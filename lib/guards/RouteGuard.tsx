"use client"

import {useEffect} from "react";
import {usePathname, useRouter} from "next/navigation";
import {StorageGuard} from "@/lib/guards/StorageGuard";

interface RouteGuardProps {
    children?: React.ReactNode
}
const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
    const router = useRouter();
    const pathName = usePathname()
    useEffect(() => {
        StorageGuard.clearRouteStorages(pathName)
    }, [pathName, router]);
    return (
        <>
            {children}
        </>
    )
}

export default RouteGuard;