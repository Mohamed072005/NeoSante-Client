"use client"

import { useState, useEffect, useCallback } from "react"
import { useInView } from "react-intersection-observer"
import { ProductCard } from "@/components/dashboard/pharmacies/products/ProductCard"
import { Skeleton } from "@/components/ui/skeleton"
import { Product } from "@/lib/types/product"
import {AxiosResponse} from "axios";
import {Button} from "@/components/ui/button";

const PAGE_SIZE = 8 // Number of products to load per page

export function InfiniteProductGrid({initialProducts, fetchProducts, searchQuery = "", categoryFilter = "all", stockFilter = "all", prescriptionFilter = "all",}: {
    initialProducts: Product[]
    fetchProducts: (page: number, limit: number, filters: {
        searchQuery?: string
        category?: string
        stock?: string
        prescription?: string
    }) => Promise<AxiosResponse<any, any>>
    searchQuery?: string
    categoryFilter?: string
    stockFilter?: string
    prescriptionFilter?: string
}) {
    const [products, setProducts] = useState<Product[]>(initialProducts)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [ref, inView] = useInView()

    const loadMoreProducts = useCallback(async () => {
        if (loading || !hasMore) return

        setLoading(true)
        try {
            const nextPage = page + 1
            const response = await fetchProducts(nextPage, PAGE_SIZE, {
                searchQuery,
                category: categoryFilter,
                stock: stockFilter,
                prescription: prescriptionFilter,
            })
            const newProducts = response?.data?.products

            if (newProducts?.data?.products.length < PAGE_SIZE) {
                setHasMore(false)
            }

            setProducts((prev) => [...prev, ...newProducts])
            setPage(nextPage)
        } catch (error) {
            console.error("Error loading more products:", error)
        } finally {
            setLoading(false)
        }
    }, [page, loading, hasMore, searchQuery, categoryFilter, stockFilter, prescriptionFilter, fetchProducts])

    useEffect(() => {
        if (inView) {
            loadMoreProducts()
        }
    }, [inView])

    // Reset products when filters change
    useEffect(() => {
        setProducts(initialProducts)
        setPage(1)
        setHasMore(true)
    }, [initialProducts])

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}

            {hasMore && (
                <div ref={ref} className="col-span-full flex justify-center">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="h-64 w-full rounded-lg" />
                            ))}
                        </div>
                    ) : (
                        <Button
                            onClick={loadMoreProducts}
                            variant='outline'
                        >
                            Load More
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}