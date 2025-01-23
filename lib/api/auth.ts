import { authApi } from "@/lib/axios/service";
import {LoginForm, RegisterForm, VerifyOTPForm} from "@/lib/types/auth";

export const authService = {
    login: (data: LoginForm) =>
        authApi.post("/login", data),
    register: (data: RegisterForm) =>
        authApi.post("/register", data),
    logout: () =>
        authApi.post("/auth/logout"),
    verifyOTP: (data: VerifyOTPForm) =>
        authApi.post("/verify/login", data),
}