"use client"

import type React from "react"
import {useState} from "react"
import {motion} from "framer-motion"
import {PharmacyCard} from "@/components/dashboard/pharmacies/pharmacist/PharmacyCard"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Skeleton} from "@/components/ui/skeleton"
import {Card} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {useToast} from "@/hooks/use-toast"
import {Search, Clock, X, Building2} from "lucide-react"
import type {Pharmacy} from "@/lib/types/pharmacy"
import usePharmacyApi from "@/hooks/usePharmacyApi";



export default function FindPharmaciesPage() {
    const {toast} = useToast()
    const [searchQuery, setSearchQuery] = useState("")
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])
    const [activeFilters, setActiveFilters] = useState<string[]>([])
    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const {findPharmacies, loading, error} = usePharmacyApi()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        // In a real app, this might trigger an API call
        toast({
            title: "Searching",
            description: `Finding pharmacies matching "${searchQuery}"`,
        })
    }


    const onSubmit = async () => {
        const searchParams = {
            search: searchQuery,
            filters: {
                openNow: activeFilters.includes("open"),
            }
        };
        try {
            const response = await findPharmacies(searchParams);
            if (response?.data?.statusCode === 200) {
                setPharmacies(response?.data?.pharmacies);
            }
        } catch (err) {
            toast({
                title: "Error",
                description: err as string || error,
                variant: "destructive"
            })
        }
    }

    const clearFilters = () => {
        setActiveFilters([])
        setSearchQuery("")
    }

    const toggleFilter = (filter: string) => {
        setActiveFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]))
    }

    // Rest of the previous component logic remains the same...

    return (
        <div className="min-h-screen bg-background">
            {/* Previous hero and search sections remain the same */}
            <section
                className="relative bg-gradient-to-b from-green-50 to-white dark:from-green-950/20 dark:to-background py-16">
                <div className="container px-4">
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5}}
                        className="max-w-3xl mx-auto text-center mb-8"
                    >
                        <h1 className="text-4xl font-bold tracking-tight mb-4">Find Pharmacies Near You</h1>
                        <p className="text-lg text-muted-foreground mb-8">
                            Search for pharmacies by name, address, or city to find what you need
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5, delay: 0.2}}
                        className="max-w-2xl mx-auto"
                    >
                        <form onSubmit={handleSearch} className="relative">
                            <div
                                className={`relative rounded-lg shadow-lg transition-all duration-300 ${
                                    isSearchFocused ? "ring-2 ring-green-500 ring-offset-2" : ""
                                }`}
                            >
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-muted-foreground"/>
                                </div>
                                <Input
                                    type="text"
                                    placeholder="Search pharmacies by name, address, or city..."
                                    className="pl-12 pr-20 py-6 text-lg rounded-lg border-0 shadow-none"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    <Button onClick={onSubmit} type="submit" size="sm"
                                            className="bg-green-600 hover:bg-green-700 text-white">
                                        Search
                                    </Button>
                                </div>
                            </div>
                        </form>

                        <div className="flex flex-wrap items-center justify-between mt-4">
                            <div className="flex flex-wrap gap-2 mt-2">
                                <Button
                                    variant={activeFilters.includes("open") ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => toggleFilter("open")}
                                    className={activeFilters.includes("open") ? "bg-green-600 hover:bg-green-700" : ""}
                                >
                                    <Clock className="mr-2 h-4 w-4"/>
                                    Open Now
                                </Button>
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                                className="mt-2"
                                disabled={activeFilters.length === 0 && !searchQuery}
                            >
                                <X className="mr-2 h-4 w-4"/>
                                Clear Filters
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
            {/* Results Section */}
            <section className="py-12">
                <div className="container px-4">
                    {/* Previous results header remains the same */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">{pharmacies.length} Pharmacies Found</h2>
                            <p className="text-muted-foreground mt-1">
                                {activeFilters.length > 0 && <span>Filtered by: {activeFilters.join(", ")}</span>}
                                {searchQuery && (
                                    <span>
                                        {activeFilters.length > 0 ? " and " : ""}Search: {searchQuery}
                                    </span>
                                )}
                                {activeFilters.length === 0 && !searchQuery && <span>Showing all pharmacies</span>}
                            </p>
                        </div>
                    </div>
                    <div
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6
                                           max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin
                                           scrollbar-thumb-green-500 scrollbar-track-green-100"
                    >
                        {loading ? (
                            Array.from({length: 6}).map((_, index) => (
                                <Card key={index} className="overflow-hidden">
                                    <Skeleton className="h-48 w-full"/>
                                    <div className="p-4">
                                        <Skeleton className="h-6 w-3/4 mb-2"/>
                                        <Skeleton className="h-4 w-full mb-2"/>
                                        <Skeleton className="h-4 w-2/3 mb-3"/>
                                        <Skeleton className="h-4 w-1/2 mb-4"/>
                                        <Skeleton className="h-10 w-full"/>
                                    </div>
                                </Card>
                            ))
                        ) : pharmacies.length === 0 ? (
                            <div className="col-span-full text-center py-12">
                                <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4"/>
                                <h3 className="text-xl font-semibold mb-2">No Pharmacies Found</h3>
                                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                    We could not find any pharmacies matching your search criteria.
                                </p>
                                <Button onClick={() => {
                                    setSearchQuery("")
                                    setActiveFilters([])
                                }}>
                                    Clear Filters
                                </Button>
                            </div>
                        ) : (
                            pharmacies.map((pharmacy) => (
                                <PharmacyCard key={pharmacy._id} pharmacy={pharmacy}/>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Popular Searches Section remains the same */}
            <section className="py-12 bg-muted/30">
                <div className="container px-4">
                    <h2 className="text-2xl font-bold tracking-tight mb-6">Popular Searches</h2>
                    <div className="flex flex-wrap gap-2">
                        {[
                            "24/7 Pharmacies",
                            "Drive-thru",
                            "Vaccination Services",
                            "Compounding Pharmacies",
                            "Delivery Available",
                            "Prescription Refill",
                            "Health Screenings",
                            "Medication Counseling",
                        ].map((term) => (
                            <Badge
                                key={term}
                                variant="outline"
                                className="px-4 py-2 text-sm cursor-pointer hover:bg-accent"
                                onClick={() => {
                                    setSearchQuery(term)
                                    // In a real app, this would trigger a search
                                }}
                            >
                                {term}
                            </Badge>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}