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

    const getPharmacyProduct = async (product_id: string) => {
        setLoading(true);
        try {
            const response = await productService.getPharmacyProduct(product_id);
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

    const updateProduct = async (product: ProductFormValues, product_id: string) => {
        setLoading(true);
        try {
            const response = await productService.updateProduct(product, product_id);
            return response;
        }catch (e: unknown) {
            const {message, constraints} = handleError(e);
            setError(message as string);
            setLoading(false);
            throw constraints as string || message;
        } finally {
            setLoading(false);
        }
    }

    const fetchProductsForClients = async (
        page: number,
        limit: number,
        filters: {
            searchQuery?: string;
            category?: string;
            stock?: string;
            prescription?: string;
        } = {}) => {
        setLoading(true);
        try {
            const response = await productService.fetchProducts(
                page,
                limit,
                filters.searchQuery,
                filters.category === "all" ? undefined : filters.category,
                filters.stock === "inStock" ? true :
                    filters.stock === "outOfStock" ? false : undefined,
                filters.prescription === "required" ? true :
                    filters.prescription === "notRequired" ? false : undefined
            );
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
        fetchPharmacistProducts,
        getPharmacyProduct,
        updateProduct,
        fetchProductsForClients
    }
}