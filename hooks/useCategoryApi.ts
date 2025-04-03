import {useState} from "react";
import {UseCategoryApi} from "@/lib/types/category";
import {categoryService} from "@/lib/api/category";
import {handleError} from "@/lib/utils/handleError";

export const useCategoryApi = (): UseCategoryApi => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getAllCategories = async () => {
        setLoading(true);
        try {
            const response = await categoryService.fetchCategories();
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
        getAllCategories
    }

}