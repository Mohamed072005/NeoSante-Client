"use client"

import type React from "react"

import ThemeToggle from "@/components/theme/ThemeToggle"
import {LogOut} from "lucide-react"
import {DashboardSidebar} from "@/components/layout/dashboard/DashboardSidbar";
import Link from "next/link";
import {SidebarItem} from "@/lib/types/layout";

export default function DashboardNav({children, sidebarItems, userRole}: {children: React.ReactNode, sidebarItems: SidebarItem[], userRole: string}) {

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Sidebar */}
            <DashboardSidebar sidebarItems={sidebarItems} />
            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Header */}
                <header className="flex h-16 items-center justify-between border-b px-6">
                    <h1 className="text-xl font-semibold">{ userRole } Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <ThemeToggle/>
                        <Link data-testid="auth-link" href="/auth" className="border border-input bg-background shadow-sm hover:bg-red-500 hover:text-accent-foreground py-2 px-4 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
                            <LogOut className="h-4 w-4"/>
                            Logout
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-6">{children}</main>
            </div>
        </div>
    )
}

