import {useState} from "react";
import {ProductFormValues, UseProductAPI} from "@/lib/types/product";
import {handleError} from "@/lib/utils/handleError";
import {productService} from "@/lib/api/product";

export const useProductApi = (): UseProductAPI => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const createProduct = async (product: ProductFormValues) => {
        setLoading(true);
        try {
            const response = await productService.askCreateProduct(product);
            return response;
        }catch (e: unknown) {
            const {message, constraints} = handleError(e);
            setError(message as string);
            setLoading(false);
            throw constraints as string || message;
        }finally {
            setLoading(false);
        }
    }

    const fetchPharmacistProducts = async () => {
        try {
            const response = await productService.getPharmacistProducts();
            return response;
        }catch (e: unknown) {
            const {message, constraints} = handleError(e);
            setError(message as string);
            setLoading(false);
            throw constraints as string || message;
        }finally {
            setLoading(false);
        }
    }

    return {
        loading,
        error,
        createProduct,
        fetchPharmacistProducts
    }
}