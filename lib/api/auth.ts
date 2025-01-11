import { authApi } from "@/lib/axios/service";
import {LoginForm, RegisterForm} from "@/lib/types/auth";

export const authService = {
    login: (data: LoginForm) =>
        authApi.post("/login", data),
    register: (data: RegisterForm) =>
        authApi.post("/auth/register", data),
    logout: () =>
        authApi.post("/auth/logout"),
}