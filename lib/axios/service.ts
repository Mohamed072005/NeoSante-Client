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
            const token = tokenStorage.get() || OTPTokenStorage.get();
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
            // if (error.response?.status === 401) {
            //     window.location.href = '/auth/login';
            // }
            return Promise.reject(error);
        }
    )

    return instance;
}

const SERVERS = {
    AUTH: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL
}

export const authApi = createApiInstance(SERVERS.AUTH);