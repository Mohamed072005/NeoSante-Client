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
}

export interface Token {
    data: string;
}

export interface ResetCountdownOTP {
    data: string;
}