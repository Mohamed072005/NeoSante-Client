"use client"

import {useState, useEffect, useCallback, useMemo} from "react"
import { useParams, useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { ProductDetailView } from "@/components/dashboard/pharmacies/products/ProductDetailsView"
import { Pill } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/types/product"
import { Icons } from "@/components/icons/icons"
import { ArrowLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useScrollTop } from "@/hooks/useScrollTop"
import {useProductsContext} from "@/context/ProductsContext";
import {usePharmaciesContext} from "@/context/PharmaciesContext";

export default function ProductDetailsPage() {
    const router = useRouter()
    const params = useParams<{ id: string }>()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(true)
    const [product, setProduct] = useState<Product | null>(null)
    const { findProductById } = useProductsContext()
    const { getPharmaciesIds } = usePharmaciesContext()
    const pharmaciesIds = useMemo(() => getPharmaciesIds(), [getPharmaciesIds])
    useScrollTop()

    const fetchProduct = useCallback(async () => {
        if (!params.id) {
            toast({
                title: "Error",
                description: "Product ID is missing.",
                variant: "destructive",
            })
            return;
        }
        setIsLoading(true)
        try {
            const product = await findProductById(params.id);
            if (!pharmaciesIds.includes(product?.pharmacyId?._id || '')) {
                setProduct(null);
            }else {
                setProduct(product);
            }
        }catch (error) {
            toast({
                title: "Error",
                description: error as string,
                variant: "destructive",
            });
        }finally {
            setIsLoading(false)
        }

    }, [params.id, findProductById, getPharmaciesIds, pharmaciesIds]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct])

    const handleDeleteProduct = async (productId: string) => {
        try {
            // Mock API call - replace with actual API call
            await new Promise((resolve) => setTimeout(resolve, 800))

            toast({
                title: "Product deleted",
                description: "The product has been successfully deleted",
            })

            router.push("/pharmacist/products")
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete product. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <AnimatePresence mode="wait">
            {isLoading ? (
                <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center min-h-[400px]"
                >
                    <motion.div
                        animate={{
                            rotate: 360,
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                        }}
                    >
                        <Icons.spinner className="h-12 w-12 text-green-600" />
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-muted-foreground mt-4"
                    >
                        Loading product details...
                    </motion.p>
                </motion.div>
            ) : !product ? (
                <motion.div
                    key="not-found"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-6"
                >
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/pharmacist/products")}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h1 className="text-3xl font-bold tracking-tight">Product Not Found</h1>
                    </div>
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            >
                                <Pill className="h-16 w-16 text-muted-foreground mb-4" />
                            </motion.div>
                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="text-xl font-semibold mb-2"
                            >
                                Product Not Found
                            </motion.h2>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-muted-foreground mb-6"
                            >
                                The product you are looking for does not exist or has been removed.
                            </motion.p>
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                                <Button onClick={() => router.push("/pharmacist/products")}>Return to Products</Button>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
            ) : (
                <motion.div
                    key="product-details"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ProductDetailView
                        product={product}
                        viewType="pharmacist"
                        onDelete={handleDeleteProduct}
                        onEdit={(id: string) => router.push(`/pharmacist/products/${id}/edit`)}
                        onBack={() => router.push("/dashboard/pharmacist/products")}
                        backUrl="/dashboard/pharmacist/products"
                        showInventory={true}
                        showMetadata={true}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    )
}

