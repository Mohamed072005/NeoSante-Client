"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTable } from "@/components/dashboard/pharmacies/products/DataTable"
import { ProductColumns } from "@/components/dashboard/pharmacies/products/Columns"
import { useToast } from "@/hooks/use-toast"
import { Search, Plus, FileText } from "lucide-react"
import type { Product } from "@/lib/types/product"
import {useCategoriesContext} from "@/context/CategoriesContext";
import {usePharmaciesContext} from "@/context/PharmaciesContext";
import {useProductApi} from "@/hooks/useProductApi";
import {useProductsContext} from "@/context/ProductsContext";

export default function ProductsPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [products, setProducts] = useState<Product[]>([])
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedPharmacy, setSelectedPharmacy] = useState<string | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<string>("all")
    const [stockFilter, setStockFilter] = useState<string>("all")
    const [prescriptionFilter, setPrescriptionFilter] = useState<string>("all")
    const [editingStockId, setEditingStockId] = useState<string | null>(null);
    const [tempStockValue, setTempStockValue] = useState("");
    const { categories } = useCategoriesContext()
    const { pharmacies } = usePharmaciesContext()
    const { fetchPharmacistProducts, loading, error } = useProductApi()
    const { setProductsContextState } = useProductsContext()

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const response = await fetchPharmacistProducts()
            if (response?.data?.statusCode === 200) {
                setProducts(response?.data?.products);
                setFilteredProducts(response?.data?.products);
                setProductsContextState(response?.data?.products);
            }
        } catch (err: unknown) {
            console.log(err || error)
            toast({
                title: "Error",
                description: error || err as string,
                variant: "destructive",
            })
        }
    }

    useEffect(() => {
        let filtered = products

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(
                (product) =>
                    product.name.toLowerCase().includes(query) ||
                    product.genericName?.toLowerCase().includes(query) ||
                    false ||
                    product.description.toLowerCase().includes(query) ||
                    product.barcode?.toLowerCase().includes(query) ||
                    false,
            )
        }

        if (selectedPharmacy){
            filtered = filtered.filter((product) => product.pharmacyId._id === selectedPharmacy);
        }

        if (selectedCategory !== "all") {
            filtered = filtered.filter((product) => product.category._id === selectedCategory)
        }

        if (stockFilter === "inStock") {
            filtered = filtered.filter((product) => product.stock > 0)
        } else if (stockFilter === "lowStock") {
            filtered = filtered.filter((product) => product.stock > 0 && product.stock <= 10)
        } else if (stockFilter === "outOfStock") {
            filtered = filtered.filter((product) => product.stock === 0)
        }

        if (prescriptionFilter === "required") {
            filtered = filtered.filter((product) => product.requiresPrescription)
        } else if (prescriptionFilter === "notRequired") {
            filtered = filtered.filter((product) => !product.requiresPrescription)
        }

        setFilteredProducts(filtered)
    }, [searchQuery, selectedCategory, stockFilter, prescriptionFilter, products, selectedPharmacy])

    const handleDeleteProduct = async (productId: string) => {
        try {
            // Mock API call - replace with actual API call
            await new Promise((resolve) => setTimeout(resolve, 800))

            // Update local state
            setProducts((prev) => prev.filter((product) => product._id !== productId))

            toast({
                title: "Product deleted",
                description: "The product has been successfully deleted",
            })
        } catch (error: unknown) {
            toast({
                title: "Error",
                description: "Failed to delete product. Please try again.",
                variant: "destructive",
            })
        }
    }

    const handleUpdateStock = async (productId: string, newStock: number) => {
        try {
            // Mock API call - replace with actual API call
            await new Promise((resolve) => setTimeout(resolve, 800))

            // Update local state
            setProducts((prev) =>
                prev.map((product) =>
                    product._id === productId
                        ? {
                            ...product,
                            stock: newStock,
                            lastStockUpdate: new Date().toISOString(),
                        }
                        : product,
                ),
            )

            toast({
                title: "Stock updated",
                description: "The product stock has been successfully updated",
            })
        } catch (error: unknown) {
            toast({
                title: "Error",
                description: "Failed to update stock. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/pharmacist/products/export")}>
                        <FileText className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Button onClick={() => router.push(`/dashboard/pharmacist/products/new?pharmacyId=${selectedPharmacy}`)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                    </Button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-64">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Filters</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Pharmacy</label>
                                <Select value={selectedPharmacy || ""} onValueChange={setSelectedPharmacy}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select pharmacy" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {pharmacies?.map((pharmacy) => (
                                            <SelectItem key={pharmacy._id} value={pharmacy._id}>
                                                {pharmacy.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

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
                                <label className="text-sm font-medium">Stock Status</label>
                                <Select value={stockFilter} onValueChange={setStockFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All stock" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Stock</SelectItem>
                                        <SelectItem value="inStock">In Stock</SelectItem>
                                        <SelectItem value="lowStock">Low Stock (≤ 10)</SelectItem>
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

                            <div className="pt-2">
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => {
                                        setSelectedCategory("all")
                                        setStockFilter("all")
                                        setPrescriptionFilter("all")
                                        setSearchQuery("")
                                        setSelectedPharmacy(null);
                                    }}
                                >
                                    Reset Filters
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex-1">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <CardTitle>Product Inventory</CardTitle>
                                    <CardDescription>
                                        Manage your pharmacy products. {filteredProducts.length} products found.
                                    </CardDescription>
                                </div>
                                <div className="relative w-full sm:w-auto">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search products..."
                                        className="pl-8 w-full sm:w-[250px]"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                columns={ProductColumns({
                                    onDelete: handleDeleteProduct,
                                    onUpdateStock: handleUpdateStock,
                                    onView: (id) => router.push(`/dashboard/pharmacist/products/${id}`),
                                    onEdit: (id) => router.push(`/dashboard//pharmacist/products/${id}/edit`),
                                    editingStockId: editingStockId,
                                    setEditingStockId: setEditingStockId,
                                    tempStockValue: tempStockValue,
                                    setTempStockValue: setTempStockValue
                                })}
                                data={filteredProducts}
                                isLoading={loading}

                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

