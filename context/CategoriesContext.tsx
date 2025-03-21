"use client"

import {createContext, useContext, useEffect, useState} from "react";
import {Category} from "@/lib/types/category";
import {useCategoryApi} from "@/hooks/useCategoryApi";

interface CategoriesContextType {
    categories: Category[] | null;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const useCategoriesContext = () => {
    const context = useContext(CategoriesContext);
    if (!context){
        throw new Error("useCategoriesContext must be used within a CategoriesProvider");
    }
    return context;
}

export const CategoriesProvider = ({ children }: { children: React.ReactNode }) => {
    const [categories, setCategories] = useState<Category[] | null>(null);
    const { getAllCategories } = useCategoryApi()

    useEffect(() => {
        const initialValues = async () => {
            if (!categories){
                await fetchCategories();
            }
        }
        initialValues();
    })

    const fetchCategories = async () => {
        try {
            const response = await getAllCategories();
            setCategories(response?.data?.categories);
        }catch (error) {
            console.log(error);
        }
    }

    return (
        <CategoriesContext.Provider value={{ categories }}>
            { children }
        </CategoriesContext.Provider>
    )
}