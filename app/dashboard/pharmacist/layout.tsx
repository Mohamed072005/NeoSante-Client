import {SidebarItem} from "@/lib/types/layout";
import {Building2, HomeIcon, LayoutDashboard, Users, Package} from "lucide-react";
import type React from "react";
import DashboardNav from "@/components/layout/dashboard/DashboardNav";
import {PharmaciesProvider} from "@/context/PharmaciesContext";

interface PharmacistLayoutProps {
    children?: React.ReactNode;
}

const PharmacistLayout: React.FC<PharmacistLayoutProps> = ({ children }) => {

    const sidebarItems: SidebarItem[] = [
        {
            title: "Dashboard",
            href: "/dashboard/pharmacist",
            icon: <LayoutDashboard className="h-5 w-5" />,
        },
        {
            title: "Pharmacies",
            href: "/dashboard/pharmacist/pharmacies",
            icon: <Building2 className="h-5 w-5" />,
            submenu: [
                { title: "All Your Pharmacies", href: "/dashboard/pharmacist/pharmacies" },
            ],
        },
        {
            title: "Helpers",
            href: "/dashboard/pharmacist/pharmacies/helpers",
            icon: <Users className="h-5 w-5" />,
        },
        {
            title: "Products",
            href: "/dashboard/pharmacist/products",
            icon: <Package className="h-5 w-5" />,
        },
        {
            title: "Home",
            href: "/",
            icon: <HomeIcon className="h-5 w-5" />,
        }
    ]

    return (
        <>
            <PharmaciesProvider>
                <DashboardNav sidebarItems={sidebarItems} userRole="Pharmacist">
                    {children}
                </DashboardNav>
            </PharmaciesProvider>
        </>
    )
}

export default PharmacistLayout;