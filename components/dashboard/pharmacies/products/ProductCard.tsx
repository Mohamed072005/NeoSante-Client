"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import type { Product } from "@/lib/types/product"

interface ProductCardProps {
    product: Product
    viewType?: "admin" | "pharmacist" | "user"
    onAddToCart?: (productId: string) => void
    onAddToWishlist?: (productId: string) => void
    className?: string
    linkPrefix?: string
}

export function ProductCard({product, viewType = "user", onAddToCart, onAddToWishlist, className, linkPrefix = "/products"}: ProductCardProps) {
    const isPharmacistView = viewType === "pharmacist"

    return (
        <Card className={cn("overflow-hidden transition-all hover:shadow-md", className)}>
            <div className="relative aspect-square">
                <img src={product.image || "/placeholder.svg"} alt={product.name} className="object-cover w-full h-full" />
                {product.requiresPrescription && (
                    <Badge className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600">Prescription</Badge>
                )}
                {!isPharmacistView && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Link href={`${linkPrefix}/${product._id}`}>
                            <Button variant="secondary" size="sm" className="mr-2">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
            <CardContent className="p-4">
                <div className="mb-1">
                    <Badge variant="outline" className="text-xs font-normal">
                        {product.category.category_name}
                    </Badge>
                </div>
                <Link href={`${linkPrefix}/${product._id}`} className="hover:underline">
                    <h3 className="font-medium line-clamp-1">{product.name}</h3>
                </Link>
                {product.genericName && <p className="text-xs text-muted-foreground line-clamp-1">{product.genericName}</p>}

                {isPharmacistView ? (
                    <div className="mt-2 text-sm">
            <span
                className={cn(
                    "font-medium",
                    product.stock === 0 ? "text-red-500" : product.stock <= 10 ? "text-amber-500" : "text-green-500",
                )}
            >
              Stock: {product.stock}
            </span>
                    </div>
                ) : (
                    <div className="mt-2">
                        {product.stock > 0 ? (
                            <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
                            >
                                In Stock
                            </Badge>
                        ) : (
                            <Badge
                                variant="outline"
                                className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800"
                            >
                                Out of Stock
                            </Badge>
                        )}
                    </div>
                )}
            </CardContent>

            {!isPharmacistView && (
                <CardFooter className="p-4 pt-0 flex justify-between">
                    {onAddToCart && (
                        <Button
                            size="sm"
                            onClick={() => onAddToCart(product._id)}
                            disabled={product.stock === 0}
                            className="flex-1 mr-2"
                        >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Add
                        </Button>
                    )}
                    {onAddToWishlist && (
                        <Button size="sm" variant="outline" onClick={() => onAddToWishlist(product._id)}>
                            <Heart className="h-4 w-4" />
                        </Button>
                    )}
                </CardFooter>
            )}
        </Card>
    )
}

