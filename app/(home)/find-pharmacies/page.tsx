"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { PharmacyCard } from "@/components/dashboard/pharmacies/pharmacist/PharmacyCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Search, MapPin, Clock, X, Star, Locate, Building2 } from "lucide-react"
import type { Pharmacy } from "@/lib/types/pharmacy"

// Leaflet imports
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

export default function FindPharmaciesPage() {
    const { toast } = useToast()
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])
    const [filteredPharmacies, setFilteredPharmacies] = useState<Pharmacy[]>([])
    const [activeFilters, setActiveFilters] = useState<string[]>([])
    const [view, setView] = useState<"list" | "map">("list")
    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null)


    useEffect(() => {
        // Simulate loading pharmacies
    }, [])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        // In a real app, this might trigger an API call
        toast({
            title: "Searching",
            description: `Finding pharmacies matching "${searchQuery}"`,
        })
    }

    // Get user's current location
    const handleUseMyLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords
                    setUserLocation([latitude, longitude])
                    toast({
                        title: "Location Found",
                        description: "Your current location has been detected.",
                    })
                },
                (error) => {
                    toast({
                        title: "Location Error",
                        description: error.message,
                        variant: "destructive"
                    })
                }
            )
        } else {
            toast({
                title: "Location Unavailable",
                description: "Geolocation is not supported by your browser.",
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
            <section className="relative bg-gradient-to-b from-green-50 to-white dark:from-green-950/20 dark:to-background py-16">
                <div className="container px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-3xl mx-auto text-center mb-8"
                    >
                        <h1 className="text-4xl font-bold tracking-tight mb-4">Find Pharmacies Near You</h1>
                        <p className="text-lg text-muted-foreground mb-8">
                            Search for pharmacies by name, address, or city to find what you need
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="max-w-2xl mx-auto"
                    >
                        <form onSubmit={handleSearch} className="relative">
                            <div
                                className={`relative rounded-lg shadow-lg transition-all duration-300 ${
                                    isSearchFocused ? "ring-2 ring-green-500 ring-offset-2" : ""
                                }`}
                            >
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-muted-foreground" />
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
                                    <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-700 text-white">
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
                                    <Clock className="mr-2 h-4 w-4" />
                                    Open Now
                                </Button>
                                <Button
                                    variant={activeFilters.includes("topRated") ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => toggleFilter("topRated")}
                                    className={activeFilters.includes("topRated") ? "bg-green-600 hover:bg-green-700" : ""}
                                >
                                    <Star className="mr-2 h-4 w-4" />
                                    Top Rated
                                </Button>
                                <Button
                                    variant={activeFilters.includes("nearby") ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => toggleFilter("nearby")}
                                    className={activeFilters.includes("nearby") ? "bg-green-600 hover:bg-green-700" : ""}
                                >
                                    <MapPin className="mr-2 h-4 w-4" />
                                    Nearby
                                </Button>
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                                className="mt-2"
                                disabled={activeFilters.length === 0 && !searchQuery}
                            >
                                <X className="mr-2 h-4 w-4" />
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
                            <h2 className="text-2xl font-bold tracking-tight">{filteredPharmacies.length} Pharmacies Found</h2>
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

                        <div className="flex items-center gap-4 mt-4 md:mt-0">
                            <Button variant="outline" size="sm" onClick={handleUseMyLocation} className="flex items-center">
                                <Locate className="mr-2 h-4 w-4" />
                                Use My Location
                            </Button>

                            <Tabs defaultValue="list" onValueChange={(value) => setView(value as "list" | "map")}>
                                <TabsList>
                                    <TabsTrigger value="list">List View</TabsTrigger>
                                    <TabsTrigger value="map">Map View</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </div>
                    <Tabs defaultValue="list" value={view}>
                        <TabsContent value="list" className="mt-0">
                            <div
                                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6
                                           max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin
                                           scrollbar-thumb-green-500 scrollbar-track-green-100"
                            >
                                {isLoading ? (
                                    Array.from({ length: 6 }).map((_, index) => (
                                        <Card key={index} className="overflow-hidden">
                                            <Skeleton className="h-48 w-full" />
                                            <div className="p-4">
                                                <Skeleton className="h-6 w-3/4 mb-2" />
                                                <Skeleton className="h-4 w-full mb-2" />
                                                <Skeleton className="h-4 w-2/3 mb-3" />
                                                <Skeleton className="h-4 w-1/2 mb-4" />
                                                <Skeleton className="h-10 w-full" />
                                            </div>
                                        </Card>
                                    ))
                                ) : filteredPharmacies.length === 0 ? (
                                    <div className="col-span-full text-center py-12">
                                        <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
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
                                    filteredPharmacies.map((pharmacy) => (
                                        <PharmacyCard key={pharmacy._id} pharmacy={pharmacy} />
                                    ))
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="map" className="mt-0">
                            <Card className="h-[70vh]">
                                <CardContent className="p-0 h-full">
                                    {pharmacies.some(p => p.address.latitude && p.address.longitude) ? (
                                        <MapContainer
                                            center={userLocation || [40.7128, -74.0060]}
                                            zoom={13}
                                            scrollWheelZoom={false}
                                            className="h-full w-full z-10"
                                        >
                                            <TileLayer
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            {pharmacies
                                                .filter(p => p.address.latitude && p.address.longitude)
                                                .map(pharmacy => (
                                                    <Marker
                                                        key={pharmacy._id}
                                                        position={[
                                                            pharmacy.address.latitude!,
                                                            pharmacy.address.longitude!
                                                        ]}
                                                    >
                                                        <Popup>
                                                            <div className="text-center">
                                                                <h3 className="font-bold">{pharmacy.name}</h3>
                                                                <p>{pharmacy.address.street}</p>
                                                                <p>{pharmacy.address.city}</p>
                                                                <Button
                                                                    size="sm"
                                                                    className="mt-2"
                                                                    onClick={() => {
                                                                        // Navigate to pharmacy details
                                                                        window.location.href = `/pharmacies/${pharmacy._id}`
                                                                    }}
                                                                >
                                                                    View Details
                                                                </Button>
                                                            </div>
                                                        </Popup>
                                                    </Marker>
                                                ))
                                            }
                                            {userLocation && (
                                                <Marker
                                                    position={userLocation}
                                                    icon={new L.Icon({
                                                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                                                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                                                        iconSize: [25, 41],
                                                        iconAnchor: [12, 41],
                                                        popupAnchor: [1, -34],
                                                        shadowSize: [41, 41]
                                                    })}
                                                >
                                                    <Popup>Your Location</Popup>
                                                </Marker>
                                            )}
                                        </MapContainer>
                                    ) : (
                                        <div className="h-full flex items-center justify-center">
                                            <div className="text-center">
                                                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                                <p className="text-muted-foreground mb-4">No pharmacy locations available</p>
                                                <Button onClick={handleUseMyLocation}>
                                                    Enable Location Services
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
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