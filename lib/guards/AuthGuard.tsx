"use client"

import {useEffect, useState} from "react";
import useAuthStore from "@/store/authStore";
import Loader from "@/components/home/Loader";
import {usePathname} from "next/navigation";

interface AuthGuardProps {
    children?: React.ReactNode
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const { checkAuth, isLoading, isAuthenticated } = useAuthStore();
    const pathname = usePathname();
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    useEffect(() => {
        if (pathname === '/' || !isAuthenticated){
            const initialize = async () => {
                await checkAuth();
                setIsInitialized(true);
            }
            initialize();
        }
    }, [checkAuth, pathname]);

    if (isLoading || !isInitialized) {
        return (
            <Loader />
        )
    }
    return <>
        {children}
    </>
}

export default AuthGuard;