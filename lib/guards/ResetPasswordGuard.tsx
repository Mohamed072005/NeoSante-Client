"use client"

import {useEffect, useState} from "react";
import {JwtDecoder} from "@/lib/utils/jwtDecoder";
import {ResetPasswordToken} from "@/lib/types/auth";
import {withLocalStorage} from "@/lib/utils/localStorage";
import {ResetPasswordTokenStorage} from "@/lib/types/localStorage";
import Loader from "@/components/home/Loader";
import {useRouter} from "next/navigation";
import {useToast} from "@/hooks/use-toast";

interface ResetPasswordGuardProps {
    children?: React.ReactNode;
    token: string;
}

const ResetPasswordGuard: React.FC<ResetPasswordGuardProps> = ({ token, children }) => {
    const [isValidToken, setIsValidToken] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();
    const { toast } = useToast()
    useEffect(() => {
        checkJWTAuthorization();
    }, [token])

    const checkJWTAuthorization = () => {
        try {
            const decodedToken = JwtDecoder.decode<ResetPasswordToken>(token);
            if(JwtDecoder.isTokenExpired(decodedToken.exp)) {
                toast({
                    variant: "destructive",
                    title: "Error!",
                    description: "Token expired",
                })
                router.replace("/forbidden");
                return;
            }
            if(decodedToken.identifier !== `password-reset-${decodedToken.user_id}`) {
                toast({
                    variant: "destructive",
                    title: "Error!",
                    description: "Invalid token",
                })
                router.replace("/forbidden");
                return;
            }
            const resetPasswordTokenLocalStorage = withLocalStorage<ResetPasswordTokenStorage>("resetPasswordToken");
            resetPasswordTokenLocalStorage.set({ data: token });
            setIsValidToken(true);
        }catch (e: unknown){
            toast({
                variant: "destructive",
                title: "Error!",
                description: "Invalid token",
            })
            router.replace("/forbidden");
        }finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return <Loader />;
    }

    if (!isValidToken) {
        return null;
    }

    return (
        <>
            {children}
        </>
    )
}

export default ResetPasswordGuard;