"use client"

import {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import {useProductsContext} from "@/context/ProductsContext";
import {Product, ProductFormValues} from "@/lib/types/product";
import {useToast} from "@/hooks/use-toast";
import {usePharmaciesContext} from "@/context/PharmaciesContext";
import {Icons} from "@/components/icons/icons";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {ProductForm} from "@/components/products/forms/ProductForm";
import {useCategoriesContext} from "@/context/CategoriesContext";
import {Category} from "@/lib/types/category";
import {useProductApi} from "@/hooks/useProductApi";


interface PharmaciesPropsType {
    _id: string;
    name: string;
}

const EditProductPage = () => {
    const params = useParams<{ id: string }>()
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { findProductById } = useProductsContext()
    const { pharmacies } = usePharmaciesContext()
    const { categories } = useCategoriesContext()
    const { updateProduct, loading, error } = useProductApi()
    const { toast } = useToast();

    useEffect(() => {
        fetchProduct();
    }, [params.id])

    const fetchProduct = async () => {
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
            setProduct(product);
        }catch (error) {
            toast({
                title: "Error",
                description: error as string,
                variant: "destructive",
            });
        }finally {
            setIsLoading(false)
        }

    };

    const handleSubmit = async (data: ProductFormValues) => {
        const formData = new FormData()
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("pharmacyId", data.pharmacyId);
        formData.append("stock", data.stock.toString());
        formData.append("category", data.categoryId);
        formData.append("requiresPrescription", data.requiresPrescription.toString());
        formData.append("barcode", data.barcode);
        if (data.genericName) {
            formData.append("genericName", data.genericName);
        }

        if (data.alternatives && data.alternatives.length > 0) {
            formData.append("alternatives", JSON.stringify(data.alternatives));
        }

        const productImageInput = document.querySelector('input[id="product-image"]') as HTMLInputElement;
        if (productImageInput?.files?.[0]) {
            formData.append("image", productImageInput.files[0]);
        }

        try {
            const response = await updateProduct(formData, params.id);
            if (response?.data?.statusCode === 202) {
                toast({
                    title: "Success",
                    description: response?.data?.message,
                    variant: "default",
                })
            }
            console.log(response.data.statusCode);
        }catch (err) {
            console.log(err || error);
            toast({
                title: "Error",
                description: error as string || err as string,
                variant: "destructive",
            })
        }
    }

    if (isLoading) {
        return (
            <div className="container py-10 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-2">
                    <Icons.spinner className="h-8 w-8 animate-spin text-green-600" />
                    <p className="text-muted-foreground">Loading product data...</p>
                </div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="container py-10">
                <Card>
                    <CardContent className="py-10 text-center">
                        <p className="text-muted-foreground">Product not found.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const safePharmacies = pharmacies as PharmaciesPropsType[] || [];
    const safeCategories = categories as Category[] || []

    return (
        <div className="container py-6">
            <Card>
                <CardHeader>
                    <CardTitle>Edit Product</CardTitle>
                    <CardDescription>Update the information for your product.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ProductForm
                        initialValues={product}
                        onSubmit={handleSubmit}
                        isLoading={isLoading || loading}
                        submitLabel="Update Product"
                        pharmacies={safePharmacies}
                        categories={safeCategories}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default EditProductPage;