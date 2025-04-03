"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import {DashboardCards} from "@/components/dashboard/DashboardCards";
import {Building2, Clock, ShoppingBag, Users} from "lucide-react";

export default function AdminDashboardPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalPharmacies: 0,
        totalProducts: 0,
        pendingApprovals: 0,
    })

    const cards = [
        {
            title: "Total Users",
            value: stats.totalUsers,
            icon: Users,
            description: `+${Math.floor(Math.random() * 100)} from last month`,
        },
        {
            title: "Pharmacies",
            value: stats.totalPharmacies,
            icon: Building2,
            description: `+${Math.floor(Math.random() * 20)} from last month`,
        },
        {
            title: "Products",
            value: stats.totalProducts,
            icon: ShoppingBag,
            description: `+${Math.floor(Math.random() * 200)} from last month`,
        },
        {
            title: "Pending Approvals",
            value: stats.pendingApprovals,
            icon: Clock,
            description:
                stats.pendingApprovals > 0 ? "Requires attention" : "All caught up",
        },
    ];

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true)
            try {
                // Mock API call - replace with actual API call
                await new Promise((resolve) => setTimeout(resolve, 1500))

                // Mock data
                setStats({
                    totalUsers: 1248,
                    totalPharmacies: 156,
                    totalProducts: 3427,
                    pendingApprovals: 12,
                })
            } catch (error) {
                console.error("Failed to fetch stats:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchStats()
    }, [])

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <DashboardCards cards={cards} isLoading={isLoading} />

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Overview</CardTitle>
                                <CardDescription>Platform activity for the last 30 days.</CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                {/*<Overview />*/}
                            </CardContent>
                        </Card>

                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>Latest actions across the platform.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RecentActivity />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Analytics</CardTitle>
                            <CardDescription>Detailed platform analytics and insights.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[400px] flex items-center justify-center border rounded-md">
                                <p className="text-muted-foreground">Analytics content will be displayed here.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="reports" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Reports</CardTitle>
                            <CardDescription>Generate and view platform reports.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[400px] flex items-center justify-center border rounded-md">
                                <p className="text-muted-foreground">Reports content will be displayed here.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                            <CardDescription>System notifications and alerts.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[400px] flex items-center justify-center border rounded-md">
                                <p className="text-muted-foreground">Notifications content will be displayed here.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

