"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PharmacyColumns } from "@/components/dashboard/pharmacies/pharmacist/Columns"
import { DataTable } from "@/components/dashboard/pharmacies/pharmacist/DataTable"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import type { Pharmacy } from "@/lib/types/pharmacy"
import usePharmacyApi from "@/hooks/usePharmacyApi";
import {usePharmaciesContext} from "@/context/PharmaciesContext";
import {AxiosResponse} from "axios";
import useAuthStore from "@/store/authStore";

export default function AdminPharmaciesPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isVerifiedFilter, setVerifiedAtFilter] = useState<"all" | "verified" | "unverified">("all");
    const { fetchAdminPharmacies, loading, approvePharmacy } = usePharmacyApi();
    const { setPharmaciesContextState, updatePharmacy } = usePharmaciesContext();
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);
    const { user } = useAuthStore()

    useEffect(() => {
        const fetchPharmacies = async () => {
            try {
                const response = await fetchAdminPharmacies(page, limit)
                setPharmacies(response?.data?.pharmacies)
                setTotal(response?.data?.total)
                setPharmaciesContextState(response?.data?.pharmacies);
            } catch (error) {
                console.log("Failed to fetch pharmacies:", error)
                toast({
                    title: "Error",
                    description: "Failed to load pharmacies. Please try again.",
                    variant: "destructive",
                })
            }
        }

        fetchPharmacies()
    }, [page, limit])

    const filteredPharmacies = pharmacies.filter((pharmacy) => {
        let matchesVerified;
        const matchesSearch =
            pharmacy?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pharmacy?.address?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pharmacy?.address?.street?.toLowerCase().includes(searchQuery.toLowerCase())

        if (isVerifiedFilter === "all") {
            matchesVerified = true;
        } else if (isVerifiedFilter === "verified") {
            matchesVerified = pharmacy.verifiedAt !== null;
        } else if (isVerifiedFilter === "unverified") {
            matchesVerified = pharmacy.verifiedAt === null;
        }
        return matchesSearch && matchesVerified;
    })

    const handleStatusChange = async (pharmacyId: string, newStatus: "active" | "pending" | "suspended") => {
        try {
            let response: AxiosResponse<any, any> | undefined;
            switch (newStatus) {
                case "active":
                    response = await approvePharmacy(pharmacyId);
                    break;
                default:
                    throw new Error("Invalid status");
            }
            if (response?.data?.pharmacy) {
                const updatedPharmacy = response.data.pharmacy

                setPharmacies((prevPharmacies) =>
                    prevPharmacies.map((pharmacy) =>
                        pharmacy._id === updatedPharmacy._id ? { ...pharmacy, verifiedAt: updatedPharmacy.verifiedAt } : pharmacy
                    )
                );
                updatePharmacy(updatedPharmacy._id, { verifiedAt: updatedPharmacy.verifiedAt })
                toast({
                    title: "Success",
                    description: "Pharmacy approved and set to active.",
                    variant: "default",
                })
            }

        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update pharmacy status. Please try again.",
                variant: "destructive",
            })
        }
    }

    const handleDeletePharmacy = async (pharmacyId: string) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 800))

            setPharmacies((prev) => prev.filter((pharmacy) => pharmacy._id !== pharmacyId))

            toast({
                title: "Pharmacy deleted",
                description: "The pharmacy has been successfully deleted",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete pharmacy. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="flex flex-col gap-6">

            <Tabs defaultValue="all" className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <TabsList>
                        <TabsTrigger value="all" onClick={() => setVerifiedAtFilter("all")}>
                            All
                        </TabsTrigger>
                        <TabsTrigger value="active" onClick={() => setVerifiedAtFilter("verified")}>
                            Verified
                        </TabsTrigger>
                        <TabsTrigger value="pending" onClick={() => setVerifiedAtFilter("unverified")}>
                            Pending
                        </TabsTrigger>
                    </TabsList>

                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search pharmacies..."
                            className="pl-8 w-full sm:w-[250px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <TabsContent value="all" className="m-0">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pharmacies</CardTitle>
                            <CardDescription>
                                Manage all pharmacies registered on the platform. {filteredPharmacies.length} pharmacies found.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                columns={PharmacyColumns({
                                    onStatusChange: handleStatusChange,
                                    onDelete: handleDeletePharmacy,
                                    onView: (id) => router.push(`/dashboard/admin/pharmacies/details/${id}`),
                                    isAdmin: user?.role === "Admin"
                                })}
                                data={filteredPharmacies}
                                isLoading={loading}
                                page={page}
                                limit={limit}
                                total={total}
                                onPageChange={setPage}
                                onLimitChange={setLimit}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="active" className="m-0">
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Pharmacies</CardTitle>
                            <CardDescription>All currently active pharmacies on the platform.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                columns={PharmacyColumns({
                                    onStatusChange: handleStatusChange,
                                    onDelete: handleDeletePharmacy,
                                    onView: (id) => router.push(`/dashboard/admin/pharmacies/details/${id}`),
                                    isAdmin: user?.role === "Admin"
                                })}
                                data={filteredPharmacies}
                                isLoading={loading}
                                page={page}
                                limit={limit}
                                total={total}
                                onPageChange={setPage}
                                onLimitChange={setLimit}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="pending" className="m-0">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Pharmacies</CardTitle>
                            <CardDescription>Pharmacies awaiting approval or verification.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                columns={PharmacyColumns({
                                    onStatusChange: handleStatusChange,
                                    onDelete: handleDeletePharmacy,
                                    onView: (id) => router.push(`/admin/pharmacies/details/${id}`),
                                    isAdmin: user?.role === "Admin"
                                })}
                                data={filteredPharmacies}
                                isLoading={loading}
                                page={page}
                                limit={limit}
                                total={total}
                                onPageChange={setPage}
                                onLimitChange={setLimit}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

