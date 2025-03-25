"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {PharmacyForm} from "@/components/pharmacy/forms/CreatePharmacyForm";
import {PharmacyFormData} from "@/lib/types/pharmacy";
import usePharmacyApi from "@/hooks/usePharmacyApi";
import {useToast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";

const PharmacyRegistrationPage = () => {

    const { loading, createPharmacy, error } = usePharmacyApi();
    const { toast } = useToast()
    const router = useRouter();

    const handleSubmit = async (data: PharmacyFormData ) => {

        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("city", data.city);
        formData.append("street", data.street);
        formData.append("lng", String(data.lng));
        formData.append("lat", String(data.lat));

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
            router.replace("/");
        }catch (e: unknown) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error,
            })
        }
    }
    return (
        <>
            <div className="container py-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Register Your Pharmacy</CardTitle>
                        <CardDescription>
                            Fill out the form below to register your pharmacy on our platform. All fields marked with *
                            are required.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PharmacyForm onSubmit={handleSubmit} isLoading={loading} submitLabel="Register Pharmacy"/>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default PharmacyRegistrationPage;