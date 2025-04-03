import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface PharmacyImageProps {
    image: string | null;
}

export const PharmacyImage = ({ image }: PharmacyImageProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-purple-500" />
                    Pharmacy Image
                </CardTitle>
                <CardDescription>Image of the pharmacy and its facilities.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="relative group">
                        <div className="aspect-square rounded-md overflow-hidden border">
                            <Image
                                src={image || "/placeholder.svg"}
                                alt="Pharmacy image"
                                width={500}
                                height={500}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {image && <Badge className="absolute top-2 left-2">Primary</Badge>}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};