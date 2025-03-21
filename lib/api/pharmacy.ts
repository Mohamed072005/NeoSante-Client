import {pharmacyApi} from "@/lib/axios/service";
import {PharmacyFormData} from "@/lib/types/pharmacy";

export const pharmacyService = {
    askCreatePharmacy: (data: PharmacyFormData) =>
        pharmacyApi.post("/ask/create/pharmacy", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }),
    getPharmaciesForAdmin: (page: number, limit: number) =>
        pharmacyApi.get(`/get/admin/pharmacies?page=${page}&limit=${limit}`),
    getPharmacyById: (id: string) =>
        pharmacyApi.get(`/get/pharmacy/${id}`),
    handleApprovePharmacy: (id: string) =>
        pharmacyApi.patch(`/approve/pharmacy/${id}`),
    getPharmaciesForPharmacist: (page: number, limit: number) =>
        pharmacyApi.get(`/get/pharmacist/pharmacies?page=${page}&limit=${limit}`),
    updatePharmacy: (id: string, data: PharmacyFormData) =>
        pharmacyApi.patch(`/update/pharmacy/${id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }),
    handleDeletePharmacy: (id: string) =>
        pharmacyApi.delete(`/delete/pharmacy/${id}`),
}