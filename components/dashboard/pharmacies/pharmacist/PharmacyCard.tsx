import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Star, Clock, ShieldCheck, Building2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { Pharmacy } from '@/lib/types/pharmacy';

interface PharmacyCardProps {
    pharmacy: Pharmacy;
    className?: string;
    variant?: 'default' | 'compact' | 'detailed';
}

export function PharmacyCard({pharmacy, className, variant = 'default'}: PharmacyCardProps) {
    // Determine if pharmacy is currently open
    const getCurrentStatus = () => {
        const today = new Date().getDay();
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const currentDay = days[today];

        const daySchedule = pharmacy.workingHours[currentDay];
        if (!daySchedule.is_open) return false;

        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const openTime = parseInt(daySchedule.open.split(':')[0]) * 60 +
            parseInt(daySchedule.open.split(':')[1]);
        const closeTime = parseInt(daySchedule.close.split(':')[0]) * 60 +
            parseInt(daySchedule.close.split(':')[1]);

        return currentTime >= openTime && currentTime <= closeTime;
    };

    const isOpen = getCurrentStatus();

    return (
        <Card className={cn(
            "overflow-hidden transition-all hover:shadow-md",
            variant === 'compact' && "min-w-[250px]",
            className
        )}>
            <div className="relative h-48">
                <img
                    src={pharmacy.image || "/placeholder-pharmacy.svg"}
                    alt={pharmacy.name}
                    className="object-cover w-full h-full"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                    {isOpen ? (
                        <Badge className="bg-green-500 hover:bg-green-600">Open Now</Badge>
                    ) : (
                        <Badge className="bg-red-500 hover:bg-red-600">Closed</Badge>
                    )}
                    {/*{pharmacy.emergency_services && (*/}
                        <Badge className="bg-orange-500 hover:bg-orange-600 flex items-center">
                            <Building2Icon className="w-4 h-4 mr-1" /> Emergency
                        </Badge>
                    {/*)}*/}
                </div>
            </div>

            <CardContent className="p-4">
                <Link href={`/pharmacies/${pharmacy._id}`} className="hover:underline">
                    <h3 className="font-semibold text-xl">{pharmacy.name}</h3>
                </Link>

                <div className="space-y-2 mt-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="truncate">
                            {pharmacy.address.street}, {pharmacy.address.city}
                        </span>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{pharmacy.userId.phone_number}</span>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>
                            {isOpen ? 'Open Now' : 'Closed'} •
                            {pharmacy.workingHours.monday.open} - {pharmacy.workingHours.monday.close}
                        </span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex gap-2">
                <Button asChild className="flex-1">
                    <Link href={`/pharmacies/${pharmacy._id}`}>View Details</Link>
                </Button>
                {/*{pharmacy.emergency_services && (*/}
                {/*    <Button variant="outline" className="flex-1">*/}
                {/*        Emergency Contact*/}
                {/*    </Button>*/}
                {/*)}*/}
            </CardFooter>
        </Card>
    );
}