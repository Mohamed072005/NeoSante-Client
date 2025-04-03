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
        authApi.post("/login", data),
    register: (data: RegisterForm) =>
        authApi.post("/register", data),
    logout: () =>
        authApi.post("/logout"),
    verifyOTP: (data: VerifyOTPForm) =>
        authApi.post("/verify-device", data),
    reSendOTP: (data: ResendOTPForm) =>
        authApi.post("/resend/otp", data),
    askResetPassword: (data: AskResetPasswordForm) =>
        authApi.post("/ask/reset/password", data),
    resetPassword: (data: ResetPasswordForm) =>
        authApi.post("/reset/password", data),
}