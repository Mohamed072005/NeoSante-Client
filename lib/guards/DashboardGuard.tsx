"use client"
import { useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";
import { usePathname, useRouter } from "next/navigation";
import Loader from "@/components/home/Loader";

interface DashboardGuardProps {
    children?: React.ReactNode
}

const DashboardGuard: React.FC<DashboardGuardProps> = ({ children }) => {
    const { user, isAuthenticated, isLoading } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [guardChecked, setGuardChecked] = useState(false);

    useEffect(() => {
        // Skip processing if auth is still loading
        if (isLoading) return;

        // If not authenticated, redirect to auth
        if (!isAuthenticated || !user) {
            router.replace("/auth");
            return;
        }

        // Handle role-based routing
        if (pathname === "/dashboard") {
            // Direct to role-specific dashboard
            if (user.role === "Admin") {
                router.replace("/dashboard/admin");
            } else if (user.role === "Pharmacy") {
                router.replace("/dashboard/pharmacist");
            } else {
                router.replace("/forbidden");
            }
            return;
        }

        // Check access to specific dashboard areas
        const isAdminPath = pathname.includes("/dashboard/admin");
        const isPharmacistPath = pathname.includes("/dashboard/pharmacist");

        if (isAdminPath && user.role !== "Admin") {
            router.replace("/forbidden");
            return;
        }

        if (isPharmacistPath && user.role !== "Pharmacy") {
            router.replace("/forbidden");
            return;
        }

        // If we reach here, user is authorized
        setGuardChecked(true);
    }, [isLoading, isAuthenticated, user, pathname, router]);
    // Show loader if auth is still loading or guard checks haven't completed
    if (isLoading || !guardChecked) {
        return <Loader />;
    }

    return children;
};

export default DashboardGuard;