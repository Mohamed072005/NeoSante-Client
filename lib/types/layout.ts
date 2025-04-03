import type React from "react";

export interface SidebarItem {
    title: string
    href: string
    icon: React.ReactNode
    submenu?: { title: string; href: string }[]
}