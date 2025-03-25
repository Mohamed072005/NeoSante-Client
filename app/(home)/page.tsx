'use client'

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Stethoscope, Clock, MapPin, Pill, CalendarCheck, BookOpen, ArrowRight } from 'lucide-react'

export default function Home() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="container px-4 py-16 md:py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-green-600 to-emerald-800 bg-clip-text text-transparent">
                        NéoSanté Services at Your Fingertips
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8">
                        Find pharmacies, medical products, and expert healthcare insights all in one place
                    </p>
                </motion.div>

                {/* Main Categories */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {/* Pharmacy Category */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card className="relative overflow-hidden hover:shadow-lg transition-shadow border-muted">
                            <CardHeader className="space-y-1">
                                <div className="flex items-center space-x-3">
                                    <Building2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                                    <CardTitle className="text-2xl">Pharmacies</CardTitle>
                                </div>
                                <CardDescription className="text-base">
                                    Find nearby pharmacies and check medication availability
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-start space-x-2">
                                            <Clock className="h-5 w-5 text-green-600 dark:text-green-400 mt-1" />
                                            <span className="text-sm">24/7 Availability Info</span>
                                        </div>
                                        <div className="flex items-start space-x-2">
                                            <MapPin className="h-5 w-5 text-green-600 dark:text-green-400 mt-1" />
                                            <span className="text-sm">Location Services</span>
                                        </div>
                                        <div className="flex items-start space-x-2">
                                            <Pill className="h-5 w-5 text-green-600 dark:text-green-400 mt-1" />
                                            <span className="text-sm">Product Search</span>
                                        </div>
                                        <div className="flex items-start space-x-2">
                                            <CalendarCheck className="h-5 w-5 text-green-600 dark:text-green-400 mt-1" />
                                            <span className="text-sm">Weekend Schedule</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-4">
                                        <div className="space-x-2">
                                            <Badge variant="secondary">Open Now</Badge>
                                            <Badge variant="outline">Products</Badge>
                                        </div>
                                        <Link href="/find-pharmacies">
                                            <Button className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 dark:text-white">
                                                Find Pharmacies
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Doctor Category */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Card className="relative overflow-hidden hover:shadow-lg transition-shadow border-muted">
                            <CardHeader className="space-y-1">
                                <div className="flex items-center space-x-3">
                                    <Stethoscope className="h-8 w-8 text-emerald-600 dark:text-emerald-500" />
                                    <CardTitle className="text-2xl">Healthcare Articles</CardTitle>
                                </div>
                                <CardDescription className="text-base">
                                    Read expert medical articles and health insights
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 gap-3">
                                        <ArticlePreview
                                            title="Understanding Common Health Issues"
                                            category="General Health"
                                            date="Latest"
                                        />
                                        <ArticlePreview
                                            title="Preventive Healthcare Tips"
                                            category="Wellness"
                                            date="Featured"
                                        />
                                        <ArticlePreview
                                            title="Seasonal Health Guide"
                                            category="Health Tips"
                                            date="Trending"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between pt-4">
                                        <div className="space-x-2">
                                            <Badge variant="secondary">Articles</Badge>
                                            <Badge variant="outline">Expert Insights</Badge>
                                        </div>
                                        <Link href="/articles">
                                            <Button className="bg-emerald-600 hover:bg-indigo-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:text-white">
                                                Read Articles
                                                <BookOpen className="ml-2 h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Quick Access Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <h2 className="text-2xl font-bold mb-8">Quick Access</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <QuickAccessCard
                            icon={<MapPin className="h-6 w-6" />}
                            title="Near Me"
                            href="/pharmacies/nearby"
                        />
                        <QuickAccessCard
                            icon={<Clock className="h-6 w-6" />}
                            title="Open Now"
                            href="/pharmacies/open"
                        />
                        <QuickAccessCard
                            icon={<Pill className="h-6 w-6" />}
                            title="Products"
                            href="/products"
                        />
                        <QuickAccessCard
                            icon={<BookOpen className="h-6 w-6" />}
                            title="Articles"
                            href="/articles"
                        />
                    </div>
                </motion.div>
            </section>
        </div>
    )
}

function ArticlePreview({ title, category, date }: { title: string; category: string; date: string }) {
    return (
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
            <div className="flex flex-col">
                <span className="font-medium">{title}</span>
                <span className="text-sm text-muted-foreground">{category}</span>
            </div>
            <Badge variant="outline">{date}</Badge>
        </div>
    )
}

function QuickAccessCard({ icon, title, href }: { icon: React.ReactNode; title: string; href: string }) {
    return (
        <Link href={href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-muted">
                <CardContent className="flex flex-col items-center justify-center p-6 space-y-2">
                    <div className="text-green-600 dark:text-green-400">
                        {icon}
                    </div>
                    <span className="font-medium">{title}</span>
                </CardContent>
            </Card>
        </Link>
    )
}

