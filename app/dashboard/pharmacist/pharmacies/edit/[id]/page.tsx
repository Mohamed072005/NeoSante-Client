"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import {useParams, useRouter} from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PharmacyForm, type PharmacyFormValues } from "@/components/pharmacy/forms/CreatePharmacyForm"
import { Icons } from "@/components/icons/icons"
import {usePharmaciesContext} from "@/context/PharmaciesContext";
import useAuthStore from "@/store/authStore";
import {Pharmacy} from "@/lib/types/pharmacy";
import {Button} from "@/components/ui/button";
import {ArrowLeft, Building2} from "lucide-react";
import usePharmacyApi from "@/hooks/usePharmacyApi";

export default function EditPharmacyPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { findPharmacyById } = usePharmaciesContext();
    const { user } = useAuthStore();
    const params = useParams<{ id: string }>();
    const { updatePharmacy, error, loading } = usePharmacyApi()

    // Fetch pharmacy data
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
                if (!pharmacy || user?.user_id !== pharmacy?.userId) {
                    setPharmacy(null);
                }else {
                    setPharmacy(pharmacy);
                }
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

    const handleSubmit = async (data: PharmacyFormValues) => {
        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("city", data.address.city);
        formData.append("street", data.address.street);

        const pharmacyImageInput = document.querySelector('input[id="pharmacy-image"]') as HTMLInputElement;
        if (pharmacyImageInput?.files?.[0]) {
            formData.append("image", pharmacyImageInput.files[0]);
        } else if (data.image) {
            formData.append("image", data.image);
        }

        formData.append("certifications", JSON.stringify(data.certifications.map(cert => ({
            name: cert.name,
            date: cert.date,
            image: cert.image && !cert.image.startsWith('blob:') ? cert.image : undefined
        }))));

        data.certifications.forEach((cert, index) => {
            const certificationImageInput = document.querySelector(`input[id="cert-image-${index}"]`) as HTMLInputElement;
            if (certificationImageInput?.files?.[0]) {
                formData.append("certificationImages", certificationImageInput.files[0]);
            }
        });
        formData.append("workingHours", JSON.stringify(data.workingHours));
        try {
            const response = await updatePharmacy(params.id, formData)
            if (response?.data?.statusCode === 200) {
                toast({
                    variant: "default",
                    title: "Success!",
                    description: response.data.message,
                })
            }
        }catch (e: unknown) {
            console.log(e);
            toast({
                variant: "destructive",
                title: "Error",
                description: error,
            })
        }
    }

    if (isLoading) {
        return (
            <div className="container py-10 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-2">
                    <Icons.spinner className="h-8 w-8 animate-spin text-green-600" />
                    <p className="text-muted-foreground">Loading pharmacy data...</p>
                </div>
            </div>
        )
    }

    if (!pharmacy) {
        return (
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon"
                            onClick={() => router.push("/dashboard/pharmacist/pharmacies")}>
                        <ArrowLeft className="h-4 w-4"/>
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">Pharmacy Not Found</h1>
                </div>
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Building2 className="h-16 w-16 text-muted-foreground mb-4"/>
                        <h2 className="text-xl font-semibold mb-2">Pharmacy Not Found</h2>
                        <p className="text-muted-foreground mb-6">
                            The pharmacy you are looking for does not exist or has been removed.
                        </p>
                        <Button onClick={() => router.push("/dashboard/pharmacist/pharmacies")}>Return to
                            Pharmacies</Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Edit Pharmacy</CardTitle>
                    <CardDescription>Update your pharmacy information below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <PharmacyForm
                        initialValues={pharmacy}
                        onSubmit={handleSubmit}
                        isLoading={loading}
                        submitLabel="Update Pharmacy"
                    />
                </CardContent>
            </Card>
        </div>
    )
}

