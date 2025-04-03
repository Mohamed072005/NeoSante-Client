"use client"

import { CardTitle } from "@/components/ui/card"

import { CardHeader } from "@/components/ui/card"

import { useState, useEffect } from "react"
import {useParams, useRouter} from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { ProductDetailView } from "@/components/dashboard/pharmacies/products/ProductDetailsView"
import { Pill } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/types/product"
import { Icons } from "@/components/icons/icons"
import {useProductApi} from "@/hooks/useProductApi";

export default function PublicProductDetailsPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [product, setProduct] = useState<Product | null>(null)
    const { getPharmacyProduct, error, loading } = useProductApi()
    const params = useParams<{ id: string }>()

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await getPharmacyProduct(params.id)
                setProduct(response?.data?.product);
            } catch (err) {
                console.error("Failed to fetch product details:", error)
                toast({
                    title: "Error",
                    description: err as string || error,
                    variant: "destructive",
                })
                router.push("/products")
            }
        }

        fetchProduct()
    }, [params.id, router, toast])

    const handleAddToCart = (productId: string, quantity: number) => {
        toast({
            title: "Added to cart",
            description: `${quantity} item(s) added to your cart`,
        })
    }

    const handleShare = (productId: string) => {
        // In a real app, this would open a share dialog or copy a link
        navigator.clipboard.writeText(window.location.href)
        toast({
            title: "Link copied",
            description: "Product link copied to clipboard",
        })
    }

    if (loading) {
        return (
            <div className="container py-10 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-2">
                    <Icons.spinner className="h-8 w-8 animate-spin text-green-600" />
                    <p className="text-muted-foreground mt-4">Loading product details...</p>
                </div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="container py-10">
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Pill className="h-16 w-16 text-muted-foreground mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Product Not Found</h2>
                        <p className="text-muted-foreground mb-6">
                            The product you are looking for does not exist or has been removed.
                        </p>
                        <Button onClick={() => router.push("/products")}>Browse Products</Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container py-10">
            <ProductDetailView
                product={product}
                viewType="user"
                onBack={() => router.push("/products")}
                backUrl="/products"
                onShare={handleShare}
                showInventory={false}
                showMetadata={false}
            />

            {/* Additional user-facing sections could be added here */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Customer Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-8 text-muted-foreground">No reviews yet for this product.</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Related Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-8 text-muted-foreground">Related products will appear here.</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

