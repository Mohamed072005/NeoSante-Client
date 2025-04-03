"use client"

import {useState, useEffect} from "react";
import {Building2, Clock, Plus, ShoppingBag, Users} from "lucide-react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {DashboardCards} from "@/components/dashboard/DashboardCards";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {RecentActivity} from "@/components/dashboard/RecentActivity";

const PharmacistPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [stats, setStats] = useState({
    totalPharmacies: 0,
    activePharmacies: 0,
    totalStaff: 0,
    pendingCertifications: 0,
  })
  const router = useRouter();

  const cards = [
    {
      title: "Total Users",
      value: stats.totalPharmacies,
      icon: Users,
      description: `+${Math.floor(Math.random() * 100)} from last month`,
    },
    {
      title: "Pharmacies",
      value: stats.activePharmacies,
      icon: Building2,
      description: `+${Math.floor(Math.random() * 20)} from last month`,
    },
    {
      title: "Products",
      value: stats.pendingCertifications,
      icon: ShoppingBag,
      description: `+${Math.floor(Math.random() * 200)} from last month`,
    },
    {
      title: "Pending Approvals",
      value: stats.totalStaff,
      icon: Clock,
      description:
          stats.pendingCertifications > 0 ? "Requires attention" : "All caught up",
    },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        // Mock API call - replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Mock data
        setStats({
          totalPharmacies: 3,
          activePharmacies: 2,
          totalStaff: 8,
          pendingCertifications: 1,
        })
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])
  return (
      <>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <Button onClick={() => router.push("/pharmacist/pharmacies/new")}>
              <Plus className="mr-2 h-4 w-4"/>
              Add Pharmacy
            </Button>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <DashboardCards cards={cards} isLoading={loading}/>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                    <CardDescription>Pharmacy activity for the last 30 days.</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    {/*<PharmacistOvervie/>*/}
                  </CardContent>
                </Card>

                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest actions across your pharmacies.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentActivity />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>Detailed analytics and insights for your pharmacies.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center border rounded-md">
                    <p className="text-muted-foreground">Analytics content will be displayed here.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appointments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appointments</CardTitle>
                  <CardDescription>Manage upcoming appointments.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center border rounded-md">
                    <p className="text-muted-foreground">Appointments content will be displayed here.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </>
  );
};

export default PharmacistPage;