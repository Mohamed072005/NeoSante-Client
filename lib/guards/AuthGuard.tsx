"use client"

import {useEffect, useState} from "react";
import useAuthStore from "@/store/authStore";
import {usePathname, useRouter} from "next/navigation";
import Loader from "@/components/home/Loader";

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
            <Loader />
        )
    }
    return <>
        {children}
    </>
}

export default AuthGuard;