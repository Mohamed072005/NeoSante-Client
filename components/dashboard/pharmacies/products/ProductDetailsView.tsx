"use client"

import {useState} from "react"
import {useRouter} from "next/navigation"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {Separator} from "@/components/ui/separator"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    ArrowLeft,
    Edit,
    Trash2,
    Pill,
    Tag,
    Barcode,
    Calendar,
    ShoppingCart,
    Heart,
    Share2,
    Building
} from "lucide-react"
import type {Product} from "@/lib/types/product"
import {format} from "date-fns"
import {cn} from "@/lib/utils"
import {motion} from "framer-motion"

export interface ProductDetailViewProps {
    product: Product
    isLoading?: boolean
    viewType?: "admin" | "pharmacist" | "user"
    onDelete?: (productId: string) => Promise<void>
    onEdit?: (productId: string) => void
    onBack?: () => void
    onAddToCart?: (productId: string, quantity: number) => void
    onAddToWishlist?: (productId: string) => void
    onShare?: (productId: string) => void
    className?: string
    showInventory?: boolean
    showMetadata?: boolean
    backUrl?: string
}

// Animation variants
const containerVariants = {
    hidden: {opacity: 0},
    visible: {
        opacity: 1,
        transition: {
            when: "beforeChildren",
            staggerChildren: 0.1,
        },
    },
}

const itemVariants = {
    hidden: {opacity: 0, y: 20},
    visible: {
        opacity: 1,
        y: 0,
        transition: {type: "spring", stiffness: 300, damping: 24},
    },
}

const imageVariants = {
    hidden: {opacity: 0, scale: 0.8},
    visible: {
        opacity: 1,
        scale: 1,
        transition: {type: "spring", stiffness: 300, damping: 24, delay: 0.2},
    },
}

export function ProductDetailView({product, isLoading = false, viewType = "user", onDelete, onEdit, onBack, onAddToCart, onAddToWishlist, onShare, className, showInventory = true, showMetadata = true, backUrl,}: ProductDetailViewProps) {
    const router = useRouter()
    const [quantity, setQuantity] = useState(1)

    const isPharmacistView = viewType === "pharmacist"

    const handleBack = () => {
        if (onBack) {
            onBack()
        } else if (backUrl) {
            router.push(backUrl)
        }
    }

    const handleEdit = () => {
        if (onEdit) {
            onEdit(product._id)
        } else if (isPharmacistView) {
            router.push(`/${viewType}/products/${product._id}/edit`)
        }
    }

    if (!product) {
        return (
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                className="flex flex-col gap-6"
            >
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={handleBack}>
                        <ArrowLeft className="h-4 w-4"/>
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">Product Not Found</h1>
                </div>
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Pill className="h-16 w-16 text-muted-foreground mb-4"/>
                        <h2 className="text-xl font-semibold mb-2">Product Not Found</h2>
                        <p className="text-muted-foreground mb-6">
                            The product you are looking for does not exist or has been removed.
                        </p>
                        <Button onClick={handleBack}>Go Back</Button>
                    </CardContent>
                </Card>
            </motion.div>
        )
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={cn("flex flex-col gap-6", className)}
        >
            <motion.div variants={itemVariants}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={handleBack}>
                        <ArrowLeft className="h-4 w-4"/>
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
                    <motion.div
                        initial={{opacity: 0, scale: 0.8}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{delay: 0.3}}
                    >
                        {product.requiresPrescription ? (
                            <Badge
                                variant="outline"
                                className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
                            >
                                Prescription Required
                            </Badge>
                        ) : (
                            <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
                            >
                                No Prescription
                            </Badge>
                        )}
                    </motion.div>
                </div>

                {/* Action buttons based on view type */}
                <motion.div variants={itemVariants} className="flex items-center gap-2">
                    {isPharmacistView ? (
                        // Admin/Pharmacist actions
                        <>
                            <Button variant="outline" onClick={handleEdit}>
                                <Edit className="mr-2 h-4 w-4"/>
                                Edit
                            </Button>
                            {onDelete && (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive">
                                            <Trash2 className="mr-2 h-4 w-4"/>
                                            Delete
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete the product
                                                and remove it from your
                                                inventory.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => onDelete(product._id)}
                                                               className="bg-red-600 hover:bg-red-700">
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                        </>
                    ) : (
                        // User actions
                        <>
                            {onAddToCart && product.stock > 0 && (
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center border rounded-md">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-none"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            disabled={quantity <= 1}
                                        >
                                            -
                                        </Button>
                                        <span className="w-8 text-center">{quantity}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-none"
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            disabled={quantity >= product.stock}
                                        >
                                            +
                                        </Button>
                                    </div>
                                    <Button onClick={() => onAddToCart(product._id, quantity)}>
                                        <ShoppingCart className="mr-2 h-4 w-4"/>
                                        Add to Cart
                                    </Button>
                                </div>
                            )}
                            {onAddToWishlist && (
                                <Button variant="outline" size="icon" onClick={() => onAddToWishlist(product._id)}>
                                    <Heart className="h-4 w-4"/>
                                </Button>
                            )}
                            {onShare && (
                                <Button variant="outline" size="icon" onClick={() => onShare(product._id)}>
                                    <Share2 className="h-4 w-4"/>
                                </Button>
                            )}
                        </>
                    )}
                </motion.div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div variants={itemVariants} className="md:col-span-1">
                    <Card className="h-full">
                        <CardContent className="p-6">
                            <motion.div variants={imageVariants} className="flex justify-center mb-6">
                                <div className="w-full max-w-[300px] h-[200px] rounded-md overflow-hidden border">
                                    <img
                                        src={product.image || "/placeholder.svg"}
                                        alt={product.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </motion.div>
                            <motion.div variants={containerVariants} className="space-y-4">
                                <motion.div variants={itemVariants}>
                                    <h3 className="text-sm font-medium text-muted-foreground">Generic Name</h3>
                                    <p>{product.genericName || "N/A"}</p>
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                                    <div className="flex items-center gap-2">
                                        <Tag className="h-4 w-4 text-muted-foreground"/>
                                        <span>{product.category.category_name}</span>
                                    </div>
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <h3 className="text-sm font-medium text-muted-foreground">Pharmacy</h3>
                                    <div className="flex items-center gap-2">
                                        <Building className="h-4 w-4 text-muted-foreground"/>
                                        <span>{product.pharmacyId.name}</span>
                                    </div>
                                </motion.div>
                                {isPharmacistView && (
                                    <>
                                        {product.barcode && isPharmacistView && (
                                            <motion.div variants={itemVariants}>
                                                <h3 className="text-sm font-medium text-muted-foreground">Barcode</h3>
                                                <div className="flex items-center gap-2">
                                                    <Barcode className="h-4 w-4 text-muted-foreground"/>
                                                    <span>{product.barcode}</span>
                                                </div>
                                            </motion.div>
                                        )}
                                    </>
                                )}
                                    <motion.div variants={itemVariants}>
                                        <h3 className="text-sm font-medium text-muted-foreground">Availability</h3>
                                        <div className="mt-1">
                                            {product.stock > 10 ? (
                                                <Badge
                                                    variant="outline"
                                                    className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
                                                >
                                                    In Stock
                                                </Badge>
                                            ) : product.stock > 0 ? (
                                                <Badge
                                                    variant="outline"
                                                    className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800"
                                                >
                                                    Low Stock ({product.stock} left)
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
                                    </motion.div>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={itemVariants} className="md:col-span-2">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Product Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <motion.div variants={itemVariants}>
                                <h3 className="text-lg font-medium mb-2">Description</h3>
                                <p className="text-muted-foreground">{product.description}</p>
                            </motion.div>

                                <motion.div variants={containerVariants}>
                                    <Separator className="my-4"/>
                                    <motion.div variants={itemVariants}>
                                        <h3 className="text-lg font-medium mb-2">Inventory</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <motion.div variants={itemVariants} className="p-4 rounded-lg bg-muted/30">
                                                <div className="text-sm text-muted-foreground mb-1">Current Stock</div>
                                                <div className="text-2xl font-bold">{product.stock}</div>
                                            </motion.div>
                                            {isPharmacistView && (
                                                <>
                                                    <motion.div variants={itemVariants} className="p-4 rounded-lg bg-muted/30">
                                                        <div className="text-sm text-muted-foreground mb-1">Last Updated</div>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 text-muted-foreground"/>
                                                            <span>
                                                        {product.lastStockUpdate ? format(new Date(product.lastStockUpdate), "PPP") : "No date available"}
                                                    </span>
                                                        </div>
                                                    </motion.div>
                                                </>
                                            )}
                                        </div>
                                    </motion.div>
                                </motion.div>

                            {product.alternatives && product.alternatives.length > 0 && (
                                <motion.div variants={containerVariants}>
                                    <Separator className="my-4"/>
                                    <motion.div variants={itemVariants}>
                                        <h3 className="text-lg font-medium mb-2">Alternative Products</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {product.alternatives.map((alt, index) => (
                                                <motion.div
                                                    key={index}
                                                    variants={itemVariants}
                                                    className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full text-sm"
                                                    initial={{opacity: 0, scale: 0.8}}
                                                    animate={{opacity: 1, scale: 1}}
                                                    transition={{delay: 0.1 * index}}
                                                >
                                                    <Pill className="h-3 w-3"/>
                                                    <span>{alt}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}

                            {isPharmacistView && (
                                <motion.div variants={containerVariants}>
                                    <Separator className="my-4"/>
                                    <motion.div variants={itemVariants}>
                                        <h3 className="text-lg font-medium mb-2">Product Information</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <motion.div variants={itemVariants}>
                                                <div className="text-sm text-muted-foreground mb-1">Created</div>
                                                <div>{format(new Date(product.createdAt), "PPP")}</div>
                                            </motion.div>
                                            <motion.div variants={itemVariants}>
                                                <div className="text-sm text-muted-foreground mb-1">Last Modified</div>
                                                <div>{format(new Date(product.updatedAt), "PPP")}</div>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    )
}

