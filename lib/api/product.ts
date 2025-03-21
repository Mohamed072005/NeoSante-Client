import {ProductFormValues} from "@/lib/types/product";
import {productApi} from "@/lib/axios/service";

export const productService = {
    askCreateProduct: (data: ProductFormValues) =>
        productApi.post("/create/product", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        }),
    getPharmacistProducts: () =>
        productApi.get("/pharmacy/products")
}