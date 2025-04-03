"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ShieldAlert, ArrowLeft, Home } from "lucide-react"
import Link from "next/link"

export default function ForbiddenPage() {
    return (
        <div className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
            <div className="container px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center justify-center space-y-8 text-center"
                >
                    {/* Animated Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: 0.2,
                        }}
                        className="relative"
                    >
                        <div className="absolute -inset-4 rounded-full bg-red-500/20 blur-lg" />
                        <div className="relative bg-red-50 dark:bg-red-900/30 w-24 h-24 rounded-full flex items-center justify-center">
                            <ShieldAlert className="h-12 w-12 text-red-500" />
                        </div>
                    </motion.div>

                    {/* Error Message */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-4"
                    >
                        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Access Forbidden</h1>
                        <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                            Sorry, you don&apos;t have permission to access this page. Please check your credentials or contact
                            support if you think this is a mistake.
                        </p>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center gap-4"
                    >
                        <Button
                            variant="default"
                            className="bg-gradient-to-r from-green-600 to-emerald-700 hover:scale-105 duration-300 ease-in-out transition-all transform min-w-[160px]"
                            asChild
                        >
                            <Link href="/">
                                <Home className="mr-2 h-4 w-4" />
                                Back to Home
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            className="hover:scale-105 duration-300 ease-in-out transition-all transform min-w-[160px]"
                            onClick={() => window.history.back()}
                        >
                            <Link href="/auth" className='flex items-center gap-2'>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Go To Login
                            </Link>
                        </Button>
                    </motion.div>

                    {/* Support Link */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-sm text-muted-foreground"
                    >
                        Need help? :){" "}
                        <Link href="/" className="underline underline-offset-4 hover:text-primary">
                            Contact Support
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}

