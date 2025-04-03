"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Building2, Edit, Trash2 } from "lucide-react";
import { CertificationModal } from "@/components/dashboard/pharmacies/pharmacist/CertificationModal";
import { Pharmacy } from "@/lib/types/pharmacy";
import { usePharmaciesContext } from "@/context/PharmaciesContext";
import PharmacyOverview from "@/components/dashboard/pharmacies/pharmacist/PharmacyOverview";
import { PharmacyCertifications } from "@/components/dashboard/pharmacies/pharmacist/PharmacyCertifications";
import { PharmacyImage } from "@/components/dashboard/pharmacies/pharmacist/PharmacyImage";
import useAuthStore from "@/store/authStore";
import usePharmacyApi from "@/hooks/usePharmacyApi";

// Constants for repeated strings
const PHARMACY_NOT_FOUND_MESSAGE = "Pharmacy Not Found";
const PHARMACY_DELETED_MESSAGE = "Pharmacy deleted";

export default function PharmacyDetailsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
    const [selectedCertification, setSelectedCertification] = useState<any>(null);
    const [isCertModalOpen, setIsCertModalOpen] = useState(false);
    const { findPharmacyById } = usePharmaciesContext();
    const params = useParams<{ id: string }>();
    const { user } = useAuthStore();
    const { deletePharmacy } = usePharmacyApi()

    // Fetch pharmacy details
    const fetchPharmacy = useCallback(async () => {
        if (!params.id) {
            toast({
                title: "Error",
                description: "Pharmacy ID is missing.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            const pharmacy = await findPharmacyById(params.id);
            if (!pharmacy || user?.user_id !== pharmacy?.userId) {
                setPharmacy(null);
            } else {
                setPharmacy(pharmacy);
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to load pharmacy details. Please try again.",
                variant: "destructive",
            });
            setPharmacy(null);
        } finally {
            setIsLoading(false);
        }
    }, [params.id, toast, findPharmacyById, user]);

    useEffect(() => {
        fetchPharmacy();
    }, [fetchPharmacy]);

    const handleDeletePharmacy = useCallback(async () => {
        try {
            const response = await deletePharmacy(pharmacy?._id);
            console.log(response);
            toast({
                title: PHARMACY_DELETED_MESSAGE,
                description: "The pharmacy has been successfully deleted.",
            });

            router.push("/dashboard/pharmacist/pharmacies");
        } catch (error) {
            console.log(error);
            toast({
                title: "Error",
                description: "Failed to delete pharmacy. Please try again.",
                variant: "destructive",
            });
        }
    }, [toast, router]);

    const handleEditPharmacy = useCallback(() => {
        router.push(`/dashboard/pharmacist/pharmacies/edit/${params.id}`);
    }, [router, params.id]);

    const handleViewCertification = useCallback((cert: any) => {
        setSelectedCertification(cert);
        setIsCertModalOpen(true);
    }, []);

    const handleCloseCertModal = useCallback(() => {
        setIsCertModalOpen(false);
    }, []);

    const isLoadingState = useMemo(() => isLoading, [isLoading]);
    const isPharmacyNotFound = useMemo(() => !pharmacy, [pharmacy]);

    // Loading state
    if (isLoadingState) {
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

    // Pharmacy not found state
    if (isPharmacyNotFound) {
        return (
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/pharmacist/pharmacies")}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">{PHARMACY_NOT_FOUND_MESSAGE}</h1>
                </div>
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
                        <h2 className="text-xl font-semibold mb-2">{PHARMACY_NOT_FOUND_MESSAGE}</h2>
                        <p className="text-muted-foreground mb-6">
                            The pharmacy you are looking for does not exist or has been removed.
                        </p>
                        <Button onClick={() => router.push("/dashboard/pharmacist/pharmacies")}>Return to Pharmacies</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Main render
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/pharmacist/pharmacies")}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">{pharmacy?.name}</h1>
                    <Badge variant={pharmacy?.verifiedAt ? "default" : "outline"} className="capitalize ml-2">
                        {pharmacy?.verifiedAt ? "Verified" : "Pending"}
                    </Badge>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleEditPharmacy}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the pharmacy and all associated data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeletePharmacy} className="bg-red-600 hover:bg-red-700">
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
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
                    <PharmacyCertifications certifications={pharmacy?.certifications} onViewCertification={handleViewCertification} />
                </TabsContent>
                <TabsContent value="images" className="space-y-6">
                    <PharmacyImage image={pharmacy?.image || null} />
                </TabsContent>
            </Tabs>

            <CertificationModal isOpen={isCertModalOpen} onClose={handleCloseCertModal} certification={selectedCertification} />
        </div>
    );
}