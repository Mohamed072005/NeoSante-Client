export interface LoginForm {
    email: string;
    password: string;
}

export interface RegisterForm {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    city: string;
    phone_number: string;
    cin_number: string;
}

export  interface VerifyOTPForm {
    otp_code: string;
    rememberMe: boolean;
}

export interface ResendOTPForm {
    user_id: string;
}

export interface AskResetPasswordForm {
    email: string;
}

export interface ResetPasswordForm {
    password: string;
    confirmPassword: string;
}

export interface Role {
    id: number;
    name: string;
    permissions: RolePermissions[];
}

export interface User {
    user_id: string;
    permissions: RolePermissions[];
    role: string;
}

export interface RolePermissions {
    permission: string;
}

export interface JWTPayload {
    exp: number;
    iat: number;
    user_id: string;
    user_role: string;
    user_permissions: RolePermissions[];
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    checkAuth: () => void;
    isLoading: boolean;
}

export interface ResetPasswordToken {
    exp: number;
    iat: number;
    identifier: string;
    user_id: string;
}