"use client"

import {useEffect, useState} from "react";
import useAuthStore from "@/store/authStore";
import {usePathname, useRouter} from "next/navigation";
import Loader from "@/components/home/Loader";

interface DashboardGuardProps {
    children?: React.ReactNode;
}

const DashboardGuard: React.FC<DashboardGuardProps> = ({ children }) => {
    const { user } = useAuthStore()
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(true);
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const pathname = usePathname();

    useEffect(() => {
        if (!user) {
            router.replace("/auth");
            return;
        }
        console.log(pathname);

        const isAdminPath = pathname.includes("/dashboard/admin");
        const isPharmacistPath = pathname.includes("/dashboard/pharmacist");

        if (isAdminPath && user.role !== "Admin") {
            router.replace("/forbidden");
        } else if (isPharmacistPath && user.role !== "Pharmacy") {
            router.replace("/forbidden");
        } else if (pathname === "/dashboard") {
            if (user.role === "Admin") {
                router.replace("/dashboard/admin");
            } else if (user.role === "Pharmacy") {
                router.replace("/dashboard/pharmacist");
            } else {
                router.replace("/forbidden");
            }
        }else {
            setIsAuthorized(true)
        }

        setLoading(false);
    }, [user, pathname, router]);

    if (loading) {
        return <Loader />;
    }

    if (!isAuthorized) {
        return <Loader />;
    }

    return children;
}

export default DashboardGuard;