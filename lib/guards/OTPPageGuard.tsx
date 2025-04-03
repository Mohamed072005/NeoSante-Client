"use client"

import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {withLocalStorage} from "@/lib/utils/localStorage";
import {Token} from "@/lib/types/localStorage";

interface AuthGuardProps {
    children?: React.ReactNode
}

const OTPPageGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const router = useRouter()
    const OTPTokenStorage = withLocalStorage<Token>("OTP_token");
    useEffect(() => {
        if (!checkOPTTrigger()){
            router.replace("/auth");
        }
    }, []);

    const checkOPTTrigger = () => {
        return !!OTPTokenStorage.get();
    }

    if (!OTPTokenStorage.get()) {
        return null;
    }
    return (
        <>
            {children}
        </>
    )
}

export default OTPPageGuard;