import {AxiosResponse} from "axios";

export interface PharmacyFormData {
    name: string;
    street: string;
    city: string;
    image: string;
    certifications: PharmacyCertification[];
}

export interface PharmacyCertification {
    name: string;
    image: string;
    date: string;
}

export interface UsePharmacyAPI {
    loading: boolean;
    error: string | null;
    createPharmacy: (data: PharmacyFormData) => Promise<AxiosResponse<any, any>| undefined>;
    fetchAdminPharmacies: (page: number, limit: number) => Promise<AxiosResponse<any, any>| undefined>;
    fetchPharmacistPharmacies: (page: number, limit: number) => Promise<AxiosResponse<any, any>| undefined>;
    fetchPharmaciesById: (id: string) => Promise<AxiosResponse<any, any>>;
    approvePharmacy: (id: string) => Promise<AxiosResponse<any, any>>;
    updatePharmacy: (id: string, data: PharmacyFormData) => Promise<AxiosResponse<any, any>>;
    deletePharmacy: (id: string) => Promise<AxiosResponse<any, any>>;
}

export interface Helpers {
    email: string;
    permissions: string[];
}

export interface PharmacyAddress {
    street: string;
    city: string;
}

export interface PharmacyOwner {
    _id: string;
    first_name: string;
    email: string;
    phone_number: string;
    cin_number: string;
}

export interface WorkingHours {
    open: string;
    close: string;
}

export interface DailyWorkingHours {
    monday: WorkingHours;
    tuesday: WorkingHours;
    wednesday: WorkingHours;
    thursday: WorkingHours;
    friday: WorkingHours;
    saturday: WorkingHours;
    sunday: WorkingHours;
}

export interface Pharmacy {
    _id: string;
    name: string;
    userId: PharmacyOwner;
    address: PharmacyAddress;
    image: string;
    verifiedAt: string | null;
    certifications: PharmacyCertification[];
    helpers?: Helpers[];
    createdAt: string;
    workingHours: DailyWorkingHours;
    weekendPermanence: boolean;
}