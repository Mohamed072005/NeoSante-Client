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
        })
}