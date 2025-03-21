import {AxiosResponse} from "axios";

export interface Category {
    _id: string;
    category_name: string
}

export interface UseCategoryApi {
    loading: boolean;
    error: string | null;
    getAllCategories: () => Promise<AxiosResponse<any, any>>;
}