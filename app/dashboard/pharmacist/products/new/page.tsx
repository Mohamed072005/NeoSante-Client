"use client"

import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import {useRouter, useSearchParams} from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductForm } from "@/components/products/forms/ProductForm"
import type { ProductFormValues } from "@/lib/types/product"
import {useProductApi} from "@/hooks/useProductApi";
import {usePharmaciesContext} from "@/context/PharmaciesContext";
import {useCategoriesContext} from "@/context/CategoriesContext";
import {Category} from "@/lib/types/category";

interface PharmaciesPropsType {
    _id: string;
    name: string;
}

export default function AddProductPage() {
    const { toast } = useToast()
    const searchParams = useSearchParams()
    const { loading, createProduct, error } = useProductApi();
    const { pharmacies } = usePharmaciesContext()
    const { categories } = useCategoriesContext()
    const router = useRouter()

    useEffect(() => {
    }, [toast])

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
            const response = await createProduct(formData);
            if (response?.data?.statusCode === 200) {
                toast({
                    title: "Success",
                    description: response?.data?.message,
                    variant: 'default'
                })
                router.replace("/dashboard/pharmacist/products");
            }
        }catch (e: unknown) {
            toast({
                title: "Error",
                description: error || e as string,
                variant: "destructive",
            })
        }
    }

    const initialPharmacyId = searchParams.get("pharmacyId") || ""
    const safePharmacies = pharmacies as PharmaciesPropsType[] || [];
    const safeCategories = categories as Category[] || []

    return (
        <div className="container py-6">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Product</CardTitle>
                    <CardDescription>Fill out the form below to add a new product to your pharmacy inventory.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ProductForm
                        initialValues={{ pharmacyId: initialPharmacyId }}
                        onSubmit={handleSubmit}
                        isLoading={loading}
                        submitLabel="Add Product"
                        pharmacies={safePharmacies}
                        categories={safeCategories}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

