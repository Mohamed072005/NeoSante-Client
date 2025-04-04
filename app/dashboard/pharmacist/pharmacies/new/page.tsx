"use client"

import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PharmacyForm, type PharmacyFormValues } from "@/components/pharmacy/forms/CreatePharmacyForm"
import usePharmacyApi from "@/hooks/usePharmacyApi";

export default function AddPharmacyPage() {
    const { toast } = useToast()
    const router = useRouter()
    const { createPharmacy, error, loading } = usePharmacyApi();

    const handleSubmit = async (data: PharmacyFormValues) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("city", data.address.city);
        formData.append("street", data.address.street);
        formData.append("lng", String(data.address.lng));
        formData.append("lat", String(data.address.lat));

        const pharmacyImageInput = document.querySelector('input[id="pharmacy-image"]') as HTMLInputElement;
        if (pharmacyImageInput?.files?.[0]) {
            formData.append("image", pharmacyImageInput.files[0]);
        }

        // Add certifications as a JSON string
        formData.append("certifications", JSON.stringify(data.certifications.map(cert => ({
            name: cert.name,
            date: cert.date
        }))));

        // Add certification images
        data.certifications.forEach((_, index) => {
            const certificationImageInput = document.querySelector(`input[id="cert-image-${index}"]`) as HTMLInputElement;
            if (certificationImageInput?.files?.[0]) {
                formData.append("certificationImages", certificationImageInput.files[0]);
            }
        });

        try {
            const response = await createPharmacy(formData);
            if (response?.data?.statusCode === 201) {
                toast({
                    variant: "default",
                    title: "Success!",
                    description: response.data.message,
                })
            }
            router.replace("/dashboard/pharmacist/pharmacies");
        }catch (e: unknown) {
            console.log(e);
            toast({
                variant: "destructive",
                title: "Error",
                description: error || e as string,
            })
        }
    }

    return (
        <div className="container py-6">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Pharmacy</CardTitle>
                    <CardDescription>
                        Fill out the form below to add a new pharmacy to your account. All fields marked with * are required.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <PharmacyForm onSubmit={handleSubmit} isLoading={loading} submitLabel="Add Pharmacy" />
                </CardContent>
            </Card>
        </div>
    )
}

