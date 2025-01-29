export interface LoginForm {
    email: string;
    password: string;
}

export interface RegisterForm {
    name: string;
    email: string;
    password: string;
}

export  interface VerifyOTPForm {
    otp: string;
    rememberMe: boolean;
}

export interface ResendOTPForm {
    user_id: string;
}

export interface ResetPasswordForm {
    identifier: string;
}