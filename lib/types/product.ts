import { z } from "zod"
import {AxiosResponse} from "axios";
import {Category} from "@/lib/types/category";

export interface Product {
    _id: string
    name: string
    description: string
    pharmacyId: {
        _id: string,
        name: string,
        address: {
            street: string,
            city: string,
        },
    };
    image: string
    stock: number
    barcode: string
    genericName?: string
    category: Category;
    alternatives?: string[]
    requiresPrescription: boolean
    lastStockUpdate: string
    createdAt: string
    updatedAt: string
}

export const productFormSchema = z.object({
    name: z.string().min(2, { message: "Product name must be at least 2 characters" }),
    description: z.string().min(10, { message: "Description must be at least 10 characters" }),
    pharmacyId: z.string().min(1, { message: "Pharmacy is required" }),
    image: z.string().min(1, { message: "Product image is required" }),
    stock: z.coerce.number().min(0, { message: "Stock cannot be negative" }),
    barcode: z.string().length(12, { message: "Barcode is required" }),
    genericName: z.string().optional(),
    categoryId: z.string().min(1, { message: "Category is required" }),
    alternatives: z.array(z.string()).optional(),
    requiresPrescription: z.boolean().default(false),
})

export type ProductFormValues = z.infer<typeof productFormSchema>

export interface UseProductAPI {
    loading: boolean;
    error: string | null;
    createProduct: (product: ProductFormValues) => Promise<AxiosResponse<any, any>>;
    fetchPharmacistProducts: () => Promise<AxiosResponse<any, any>>;
}

