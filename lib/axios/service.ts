import axios, { AxiosInstance } from 'axios';
import {withLocalStorage} from "@/lib/utils/localStorage";
import {Token} from "@/lib/types/localStorage";

const createApiInstance = (baseUrl: string): AxiosInstance => {
    const instance = axios.create({
        baseURL: baseUrl,
        headers: {
            'Content-Type': 'application/json',
        }
    })

    instance.interceptors.request.use(
        async (config) => {
            const tokenStorage = withLocalStorage<Token>("token");
            const OTPTokenStorage = withLocalStorage<Token>("OTP_token");
            const resetPasswordTokenStorage = withLocalStorage<Token>("resetPasswordToken");
            const token = resetPasswordTokenStorage.get() || tokenStorage.get() || OTPTokenStorage.get();
            if (token) {
                config.headers.Authorization = `Bearer ${token.data}`;
            }
            return config;
        },
        (error) => Promise.reject(error),
    )

    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (error.response?.status === 401 && (error.response?.data?.message === 'Invalid token' || error.response?.data?.message === 'Token not provided')) {
                window.location.href = '/auth';
            }
            return Promise.reject(error);
        }
    )

    return instance;
}

const SERVERS = {
    AUTH: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:5000/auth',
    PHARMACY: process.env.NEXT_PUBLIC_PHARMACY_SERVICE_URL || 'http://localhost:5000/pharmacy',
    PRODUCT: process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || 'http://localhost:5000/product',
    CATEGORY: process.env.NEXT_PUBLIC_CATEGORY_SERVICE_URL || 'http://localhost:5000/category',
}

export const authApi = createApiInstance(SERVERS.AUTH);
export const pharmacyApi = createApiInstance(SERVERS.PHARMACY);
export const productApi = createApiInstance(SERVERS.PRODUCT);
export const categoryApi = createApiInstance(SERVERS.CATEGORY);