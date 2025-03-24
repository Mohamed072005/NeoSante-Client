"use client"

import {createContext, useCallback, useContext, useState} from "react";
import {Product} from "@/lib/types/product";
import {useProductApi} from "@/hooks/useProductApi";

interface ProductsContextType {
    products: Product[] | null;
    setProductsContextState: (products: Product[] | null) => void;
    findProductById: (id: string) => Promise<Product | null>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const useProductsContext = () => {
    const context = useContext(ProductsContext);
    if (!context) {
        throw new Error("useProductsContext must be used within a PharmaciesProvider");
    }
    return context
}

export const ProductsProvider = ({ children }: { children: React.ReactNode }) => {
    const [products, setProductsContextState] = useState<Product[] | null >(null);
    const { getPharmacyProduct } = useProductApi()

    const findProductById = useCallback(async (id: string) => {
        if (!products) {
            const response = await getPharmacyProduct(id);
            return response?.data?.product;
        }else {
            return products?.find((product) => product?._id === id);
        }
    }, [products, getPharmacyProduct]);

    return (
        <ProductsContext.Provider value={{products, findProductById, setProductsContextState}}>
            {children}
        </ProductsContext.Provider>
    )
}