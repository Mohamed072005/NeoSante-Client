"use client"

import Link from "next/link";
import useAuthStore from "@/store/authStore";

const AuthButton: React.FC = () => {
    const { isAuthenticated } = useAuthStore();
    console.log(isAuthenticated);
    return (
        <>
            {!isAuthenticated && (
                <Link data-testid="auth-link" href="/auth" className="border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground py-2 px-4 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
                    Log In
                </Link>
            )}
            {isAuthenticated && (
                <Link data-testid="auth-link" href="/auth" className="border border-input bg-background shadow-sm hover:bg-red-500 hover:text-accent-foreground py-2 px-4 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
                    Logout
                </Link>
            )}
        </>
    )
}

export default AuthButton;