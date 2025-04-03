import {categoryApi} from "@/lib/axios/service";

export const categoryService = {
    fetchCategories: () =>
        categoryApi.get('/get/categories')
}