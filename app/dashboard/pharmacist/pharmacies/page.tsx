"use client"

import {useState, useEffect, useCallback} from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PharmacyColumns } from "@/components/dashboard/pharmacies/pharmacist/Columns"
import { DataTable } from "@/components/dashboard/pharmacies/pharmacist/DataTable"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {Plus, Search} from "lucide-react"
import type { Pharmacy } from "@/lib/types/pharmacy"
import usePharmacyApi from "@/hooks/usePharmacyApi";
import {usePharmaciesContext} from "@/context/PharmaciesContext";
import useAuthStore from "@/store/authStore";
import {Button} from "@/components/ui/button";

export default function AdminPharmaciesPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isVerifiedFilter, setVerifiedAtFilter] = useState<"all" | "verified" | "unverified">("all");
    const { fetchPharmacistPharmacies, deletePharmacy, loading, error } = usePharmacyApi();
    const { setPharmaciesContextState, removePharmacy } = usePharmaciesContext();
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);
    const { user } = useAuthStore()

    useEffect(() => {
        const fetchPharmacies = async () => {
            try {
                const response = await fetchPharmacistPharmacies(page, limit)
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

    const handleDeletePharmacy = useCallback(async (pharmacyId: string) => {
        try {
            const response = await deletePharmacy(pharmacyId);
            toast({
                title: "Pharmacy deleted",
                description: response.data.message,
            })
            setPharmacies((prev) => prev.filter((pharmacy) => pharmacy._id !== pharmacyId));
            removePharmacy(pharmacyId);
        } catch (err: unknown) {
            toast({
                title: "Error",
                description: error,
                variant: "destructive",
            })
        }
    }, [router, toast]);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight">My Pharmacies</h1>
                <div className="flex items-center gap-2">
                    <Button onClick={() => router.push("/dashboard/pharmacist/pharmacies/new")}>
                        <Plus className="mr-2 h-4 w-4"/>
                        Add Pharmacy
                    </Button>
                </div>
            </div>

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
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
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
                                Manage all pharmacies registered on the platform. {filteredPharmacies.length} pharmacies
                                found.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                columns={PharmacyColumns({
                                    onDelete: handleDeletePharmacy,
                                    onView: (id) => router.push(`/dashboard/pharmacist/pharmacies/details/${id}`),
                                    onEdit: (id) => router.push(`/dashboard/pharmacist/pharmacies/edit/${id}`),
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
                                    onDelete: handleDeletePharmacy,
                                    onView: (id) => router.push(`/dashboard/pharmacist/pharmacies/details/${id}`),
                                    onEdit: (id) => router.push(`/dashboard/pharmacist/pharmacies/edit/${id}`),
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
                                    onDelete: handleDeletePharmacy,
                                    onView: (id) => router.push(`/pharmacist/pharmacies/details/${id}`),
                                    onEdit: (id) => router.push(`/dashboard/pharmacist/pharmacies/edit/${id}`),
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

