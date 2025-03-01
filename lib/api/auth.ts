import { authApi } from "@/lib/axios/service";
import {
    AskResetPasswordForm,
    LoginForm,
    RegisterForm,
    ResendOTPForm,
    ResetPasswordForm,
    VerifyOTPForm
} from "@/lib/types/auth";

export const authService = {
    login: (data: LoginForm) =>
        authApi.post("/auth/login", data),
    register: (data: RegisterForm) =>
        authApi.post("/auth/register", data),
    logout: () =>
        authApi.post("/auth/logout"),
    verifyOTP: (data: VerifyOTPForm) =>
        authApi.post("/auth/verify-device", data),
    reSendOTP: (data: ResendOTPForm) =>
        authApi.post("/auth/resend/otp", data),
    askResetPassword: (data: AskResetPasswordForm) =>
        authApi.post("/auth/ask/reset/password", data),
    resetPassword: (data: ResetPasswordForm) =>
        authApi.post("/auth/reset/password", data),
}