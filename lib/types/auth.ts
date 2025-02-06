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

export interface Role {
    id: number;
    name: string;
    permissions: string[];
}

export interface User {
    id: string;
    email: string;
    role: Role;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    checkAuth: () => void;
    isLoading: boolean;
}