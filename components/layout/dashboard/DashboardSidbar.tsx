"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Building2,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"
import {SidebarItem} from "@/lib/types/layout";

export function DashboardSidebar({ sidebarItems }: { sidebarItems: SidebarItem[]}) {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

    const toggleSubmenu = (title: string) => {
        if (openSubmenu === title) {
            setOpenSubmenu(null)
        } else {
            setOpenSubmenu(title)
        }
    }

    return (
        <div
            className={cn("relative flex flex-col border-r bg-card transition-all duration-300", collapsed ? "w-16" : "w-64")}
        >
            {/* Logo */}
            <div className="flex h-16 items-center border-b px-4">
                <Link href="/dashboard/admin" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-600 text-white">
                        <Building2 className="h-5 w-5" />
                    </div>
                    {!collapsed && <span className="text-lg font-semibold">NéoSanté Dashboard</span>}
                </Link>
            </div>

            {/* Sidebar Items */}
            <ScrollArea className="flex-1 py-4">
                <nav className="grid gap-1 px-2">
                    {sidebarItems.map((item) => (
                        <div key={item.title}>
                            {item.submenu ? (
                                <>
                                    <Button
                                        variant="ghost"
                                        className={cn(
                                            "w-full justify-start font-normal",
                                            pathname.startsWith(item.href) && "bg-accent text-accent-foreground",
                                        )}
                                        onClick={() => toggleSubmenu(item.title)}
                                    >
                                        {item.icon}
                                        {!collapsed && (
                                            <>
                                                <span className="ml-2">{item.title}</span>
                                                <ChevronRight
                                                    className={cn(
                                                        "ml-auto h-4 w-4 transition-transform",
                                                        openSubmenu === item.title && "rotate-90",
                                                    )}
                                                />
                                            </>
                                        )}
                                    </Button>
                                    {!collapsed && openSubmenu === item.title && (
                                        <div className="ml-4 mt-1 grid gap-1 pl-4 border-l">
                                            {item.submenu.map((subitem) => (
                                                <Link
                                                    key={subitem.href}
                                                    href={subitem.href}
                                                    className={cn(
                                                        "block py-2 px-2 text-sm rounded-md hover:bg-accent",
                                                        pathname === subitem.href && "bg-accent text-accent-foreground font-medium",
                                                    )}
                                                >
                                                    {subitem.title}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start font-normal",
                                        pathname === item.href && "bg-accent text-accent-foreground",
                                    )}
                                    asChild
                                >
                                    <Link href={item.href}>
                                        {item.icon}
                                        {!collapsed && <span className="ml-2">{item.title}</span>}
                                    </Link>
                                </Button>
                            )}
                        </div>
                    ))}
                </nav>
            </ScrollArea>

            {/* Collapse Button */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute -right-4 top-20 h-8 w-8 rounded-full border bg-background shadow-md"
                onClick={() => setCollapsed(!collapsed)}
            >
                {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
        </div>
    )
}

