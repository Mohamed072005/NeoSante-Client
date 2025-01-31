"use client";

export class StorageGuard {
    static clearAuthStorages(): void {
        try {
            localStorage.removeItem('OTP_token');
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
        }catch(err: any) {
            console.error('Error clearing auth storage:', err);
        }
    }

    static clearOTPStorages(): void {
        try {
            localStorage.removeItem('OTP_token');
            localStorage.removeItem('userId');
        }catch(err: any) {
            console.error('Error clearing auth storage:', err);
        }
    }

    static clearRouteStorages(route: string): void {
        switch (route) {
            case '/':
                this.clearOTPStorages();
                break;
            case '/auth':
                this.clearAuthStorages();
                break;
            default :
                break;
        }
    }
}