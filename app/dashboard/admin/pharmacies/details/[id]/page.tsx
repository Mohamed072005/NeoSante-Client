"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
    ArrowLeft,
    Building2,
    CheckCircle,
} from "lucide-react";
import { CertificationModal } from "@/components/dashboard/pharmacies/pharmacist/CertificationModal";
import { Pharmacy } from "@/lib/types/pharmacy";
import { usePharmaciesContext } from "@/context/PharmaciesContext";
import PharmacyOverview from "@/components/dashboard/pharmacies/pharmacist/PharmacyOverview";
import { PharmacyCertifications } from "@/components/dashboard/pharmacies/pharmacist/PharmacyCertifications";
import { PharmacyImage } from "@/components/dashboard/pharmacies/pharmacist/PharmacyImage";
import useAuthStore from "@/store/authStore";
import { AxiosResponse } from "axios";
import usePharmacyApi from "@/hooks/usePharmacyApi";

export default function PharmacyDetailsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
    const [selectedCertification, setSelectedCertification] = useState<any>(null);
    const [isCertModalOpen, setIsCertModalOpen] = useState(false);
    const { findPharmacyById, setPharmaciesContextState, updatePharmacy } = usePharmaciesContext();
    const params = useParams<{ id: string }>();
    const { user } = useAuthStore();
    const { approvePharmacy } = usePharmacyApi();

    useEffect(() => {
        if (!params.id) {
            toast({
                title: "Error",
                description: "Pharmacy ID is missing.",
                variant: "destructive",
            });
            return;
        }

        const fetchPharmacy = async () => {
            setIsLoading(true);
            try {
                const pharmacy = await findPharmacyById(params.id);
                setPharmacy(pharmacy);
            } catch (error) {
                console.log(error);
                toast({
                    title: "Error",
                    description: "Failed to load pharmacy details. Please try again.",
                    variant: "destructive",
                });
                setPharmacy(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPharmacy();
    }, [params.id, router, toast]);

    const handleStatusChange = async (newStatus: "active" | "pending" | "suspended") => {
        if (!pharmacy) {
            toast({
                title: "Error",
                description: "Pharmacy not found.",
                variant: "destructive",
            });
            return;
        }

        try {
            let response: AxiosResponse<any, any> | undefined;
            switch (newStatus) {
                case "active":
                    response = await approvePharmacy(params.id);
                    break;
                default:
                    throw new Error("Invalid status");
            }
            if (response?.data?.pharmacy) {
                const updatedPharmacy = response.data.pharmacy;

                setPharmacy((pharmacy) =>
                    pharmacy?._id === updatedPharmacy._id ? { ...pharmacy, verifiedAt: updatedPharmacy.verifiedAt } : pharmacy
                );
                updatePharmacy(updatedPharmacy._id, { verifiedAt: updatedPharmacy.verifiedAt })
                toast({
                    title: "Success",
                    description: "Pharmacy approved and set to active.",
                    variant: "default",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update pharmacy status. Please try again.",
                variant: "destructive",
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" disabled>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="h-8 w-48 bg-muted animate-pulse rounded-md"></div>
                </div>
                <div className="grid gap-6">
                    <div className="h-64 bg-muted animate-pulse rounded-md"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="h-48 bg-muted animate-pulse rounded-md"></div>
                        <div className="h-48 bg-muted animate-pulse rounded-md"></div>
                        <div className="h-48 bg-muted animate-pulse rounded-md"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!pharmacy) {
        return (
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/admin/pharmacies")}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">Pharmacy Not Found</h1>
                </div>
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Pharmacy Not Found</h2>
                        <p className="text-muted-foreground mb-6">
                            The pharmacy you are looking for does not exist or has been removed.
                        </p>
                        <Button onClick={() => router.push("/dashboard/admin/pharmacies")}>Return to Pharmacies</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/admin/pharmacies")}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">{pharmacy.name}</h1>
                    <Badge
                        variant={pharmacy.verifiedAt ? "default" : "outline"}
                        className="capitalize ml-2"
                    >
                        {pharmacy.verifiedAt ? "Verified" : "Pending"}
                    </Badge>
                </div>
                <div className="flex items-center gap-2">
                    {pharmacy.verifiedAt === null && (
                        <Button
                            variant="outline"
                            onClick={() => handleStatusChange("active")}
                            className="hover:bg-green-700"
                        >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Verify
                        </Button>
                    )}
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="certifications">Certifications</TabsTrigger>
                    <TabsTrigger value="images">Image</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <PharmacyOverview pharmacy={pharmacy} isAdmin={user?.role === "Admin"} />
                </TabsContent>

                <TabsContent value="certifications" className="space-y-6">
                    <PharmacyCertifications
                        certifications={pharmacy.certifications}
                        onViewCertification={(cert) => {
                            setSelectedCertification(cert);
                            setIsCertModalOpen(true);
                        }}
                    />
                </TabsContent>
                <TabsContent value="images" className="space-y-6">
                    <PharmacyImage image={pharmacy.image} />
                </TabsContent>
            </Tabs>
            <CertificationModal
                isOpen={isCertModalOpen}
                onClose={() => setIsCertModalOpen(false)}
                certification={selectedCertification}
            />
        </div>
    );
}