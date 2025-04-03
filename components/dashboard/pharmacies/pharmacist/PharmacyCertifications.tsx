import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface PharmacyCertificationsProps {
    certifications: any[];
    onViewCertification: (cert: any) => void;
}

export const PharmacyCertifications = ({ certifications, onViewCertification }: PharmacyCertificationsProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-500" />
                    Certifications
                </CardTitle>
                <CardDescription>View and manage pharmacy certifications and licenses.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {certifications.map((cert, index) => (
                        <div key={index} className="border rounded-lg p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                <div>
                                    <h3 className="text-lg font-medium">{cert.name}</h3>
                                    <Badge variant="default">Valid</Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" onClick={() => onViewCertification(cert)}>
                                        View Document
                                    </Button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-muted-foreground">Issue Date</div>
                                    <div>{format(new Date(cert.date), "PPP")}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};