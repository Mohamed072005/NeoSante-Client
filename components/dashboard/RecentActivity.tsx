"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface Activity {
    id: string
    user: {
        name: string
        avatar?: string
    }
    action: string
    target: string
    timestamp: string
    type: "user" | "pharmacy" | "product" | "system"
}

export function RecentActivity() {
    const [activities, setActivities] = useState<Activity[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchActivities = async () => {
            setIsLoading(true)
            try {
                // Mock API call - replace with actual API call
                await new Promise((resolve) => setTimeout(resolve, 1200))

                // Mock data
                const mockActivities: Activity[] = [
                    {
                        id: "1",
                        user: { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32" },
                        action: "registered",
                        target: "as a new user",
                        timestamp: "2 minutes ago",
                        type: "user",
                    },
                    {
                        id: "2",
                        user: { name: "Pharmacy Plus", avatar: "/placeholder.svg?height=32&width=32" },
                        action: "submitted",
                        target: "a new certification",
                        timestamp: "1 hour ago",
                        type: "pharmacy",
                    },
                    {
                        id: "3",
                        user: { name: "Admin", avatar: "/placeholder.svg?height=32&width=32" },
                        action: "approved",
                        target: "Central Pharmacy registration",
                        timestamp: "3 hours ago",
                        type: "system",
                    },
                    {
                        id: "4",
                        user: { name: "Sarah Johnson", avatar: "/placeholder.svg?height=32&width=32" },
                        action: "added",
                        target: "a new product",
                        timestamp: "5 hours ago",
                        type: "product",
                    },
                    {
                        id: "5",
                        user: { name: "MediPharm", avatar: "/placeholder.svg?height=32&width=32" },
                        action: "updated",
                        target: "their business hours",
                        timestamp: "1 day ago",
                        type: "pharmacy",
                    },
                    {
                        id: "6",
                        user: { name: "System", avatar: "/placeholder.svg?height=32&width=32" },
                        action: "performed",
                        target: "database maintenance",
                        timestamp: "1 day ago",
                        type: "system",
                    },
                ]

                setActivities(mockActivities)
            } catch (error) {
                console.error("Failed to fetch activities:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchActivities()
    }, [])

    if (isLoading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-3 w-[200px]" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {activities.map((activity) => (
                <div key={activity.id} className="flex items-center">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                        <AvatarFallback
                            className={cn(
                                activity.type === "user" && "bg-blue-100 text-blue-800",
                                activity.type === "pharmacy" && "bg-green-100 text-green-800",
                                activity.type === "product" && "bg-purple-100 text-purple-800",
                                activity.type === "system" && "bg-gray-100 text-gray-800",
                            )}
                        >
                            {activity.user.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                            <span className="font-semibold">{activity.user.name}</span> {activity.action}{" "}
                            <span className="font-medium">{activity.target}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

