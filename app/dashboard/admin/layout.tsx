import DashboardNav from "@/components/layout/dashboard/DashboardNav";
import type React from "react";
import {Building2, HomeIcon, LayoutDashboard, Users} from "lucide-react";
import {SidebarItem} from "@/lib/types/layout";

interface AdminDashboardLayoutProps {
    children: React.ReactNode;
}

const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({ children }) => {
    const sidebarItems: SidebarItem[] = [
        {
            title: "Dashboard",
            href: "/dashboard/admin",
            icon: <LayoutDashboard className="h-5 w-5" />,
        },
        {
            title: "Users",
            href: "/dashboard/admin/users",
            icon: <Users className="h-5 w-5" />,
            submenu: [
                { title: "All Users", href: "/dashboard/admin/users" },
                { title: "Roles", href: "/dashboard/admin/users/roles" },
            ],
        },
        {
            title: "Pharmacies",
            href: "/dashboard/admin/pharmacies",
            icon: <Building2 className="h-5 w-5" />,
            submenu: [
                { title: "All Pharmacies", href: "/dashboard/admin/pharmacies" },
            ],
        },
        {
            title: "Home",
            href: "/",
            icon: <HomeIcon className="h-5 w-5" />,
        }
    ]
    return (
        <>
            <DashboardNav sidebarItems={sidebarItems} userRole="Admin">
                {children}
            </DashboardNav>
        </>
    )
}

export default AdminDashboardLayout;