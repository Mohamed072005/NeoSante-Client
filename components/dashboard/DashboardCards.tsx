"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LucideIcon } from "lucide-react";

interface CardConfig {
    title: string;
    value: number | string;
    icon: LucideIcon;
    description?: string;
}

interface DashboardCardsProps {
    cards: CardConfig[];
    isLoading: boolean;
}

export function DashboardCards({ cards, isLoading }: DashboardCardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                        <card.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-24" />
                        ) : (
                            <>
                                <div className="text-2xl font-bold">
                                    {typeof card.value === "number"
                                        ? card.value.toLocaleString()
                                        : card.value}
                                </div>
                                {card.description && (
                                    <p className="text-xs text-muted-foreground">
                                        {card.description}
                                    </p>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}