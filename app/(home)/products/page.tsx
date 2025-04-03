"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Search, Filter } from "lucide-react"
import { InfiniteProductGrid } from "@/components/dashboard/pharmacies/products/InfiniteProductGrid"
import { useCategoriesContext } from "@/context/CategoriesContext"
import { Product } from "@/lib/types/product"
import {Skeleton} from "@/components/ui/skeleton";
import {useProductApi} from "@/hooks/useProductApi";

const PAGE_SIZE = 8;

export default function ProductsPage() {
    const { toast } = useToast()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string>("all")
    const [stockFilter, setStockFilter] = useState<string>("all")
    const [prescriptionFilter, setPrescriptionFilter] = useState<string>("all")
    const [showFilters, setShowFilters] = useState(false)
    const [initialProducts, setInitialProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { categories } = useCategoriesContext()
    const { fetchProductsForClients } = useProductApi()

    // Fetch initial products
    useEffect(() => {
        const fetchInitialProducts = async () => {
            setIsLoading(true)
            try {
                const response = await fetchProductsForClients(1, PAGE_SIZE, {
                    searchQuery: searchQuery,
                    category: selectedCategory,
                    prescription: prescriptionFilter
                })
                setInitialProducts(response?.data?.products)
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load products",
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchInitialProducts()
    }, [searchQuery, selectedCategory, stockFilter, prescriptionFilter, toast])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        // The useEffect will handle the search when searchQuery changes
    }

    return (
        <div className="container py-10">
            {/* ... (keep your existing header and filter code) ... */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                    <p className="text-muted-foreground mt-1">Browse our selection of healthcare products</p>
                </div>
                <div className="flex items-center gap-2">
                    <form onSubmit={handleSearch} className="relative w-full md:w-auto">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search products..."
                            className="pl-8 w-full md:w-[250px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                    <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)}>
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            {showFilters && (
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="text-lg">Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category</label>
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categories?.map((category) => (
                                            <SelectItem key={category._id} value={category._id}>
                                                {category.category_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Availability</label>
                                <Select value={stockFilter} onValueChange={setStockFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All products" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Products</SelectItem>
                                        <SelectItem value="inStock">In Stock</SelectItem>
                                        <SelectItem value="outOfStock">Out of Stock</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Prescription</label>
                                <Select value={prescriptionFilter} onValueChange={setPrescriptionFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All products" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Products</SelectItem>
                                        <SelectItem value="required">Prescription Required</SelectItem>
                                        <SelectItem value="notRequired">No Prescription</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSelectedCategory("all")
                                    setStockFilter("all")
                                    setPrescriptionFilter("all")
                                    setSearchQuery("")
                                }}
                            >
                                Reset Filters
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <Skeleton key={i} className="h-64 w-full rounded-lg" />
                    ))}
                </div>
            ) : (
                <InfiniteProductGrid
                    initialProducts={initialProducts}
                    fetchProducts={fetchProductsForClients}
                    searchQuery={searchQuery}
                    categoryFilter={selectedCategory}
                    stockFilter={stockFilter}
                    prescriptionFilter={prescriptionFilter}
                />
            )}
        </div>
    )
}