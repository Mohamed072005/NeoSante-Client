import { ProductFormValues} from "@/lib/types/product";
import {productApi} from "@/lib/axios/service";

export const productService = {
    askCreateProduct: (data: ProductFormValues) =>
        productApi.post("/create/product", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        }),
    getPharmacistProducts: () =>
        productApi.get("/pharmacy/products"),
    getPharmacyProduct: (product_id: string) =>
        productApi.get(`/pharmacy/product/${product_id}`),
    updateProduct: (data: ProductFormValues, product_id: string) =>
        productApi.patch(`/update/product/${product_id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        }),
    fetchProducts: (
        page: number,
        limit: number,
        search?: string,
        category?: string,
        inStock?: boolean,
        prescriptionRequired?: boolean
    ) => {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (search) params.append('search', search);
        if (category) params.append('category', category);
        if (inStock !== undefined) params.append('inStock', inStock.toString());
        if (prescriptionRequired !== undefined) {
            params.append('prescriptionRequired', prescriptionRequired.toString());
        }
        console.log(params.toString());

        return productApi.get(`/get/products?${params.toString()}`);
    },
}