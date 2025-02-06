"use client"

import {useEffect, useState} from "react";
import useAuthStore from "@/store/authStore";
import {usePathname, useRouter} from "next/navigation";
import {Loader2} from "lucide-react";

interface AuthGuardProps {
    children?: React.ReactNode
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const router = useRouter();
    const pathName = usePathname()
    const { checkAuth, isLoading } = useAuthStore();
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    useEffect(() => {
        const initialize = async () => {
            await checkAuth();
            setIsInitialized(true);
        }
        initialize();
    }, [router, pathName, checkAuth]);

    if (isLoading || !isInitialized) {
        return (
            <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50">
                <div className="fixed left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-12 w-12 animate-spin text-primary"/>
                        <p className="text-muted-foreground text-sm">Loading...</p>
                    </div>
                </div>
            </div>
        )
    }
    return <>
        {children}
    </>
}

export default AuthGuard;