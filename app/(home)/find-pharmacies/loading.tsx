import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="min-h-screen bg-background">
            <section className="relative bg-gradient-to-b from-green-50 to-white dark:from-green-950/20 dark:to-background py-16">
                <div className="container px-4">
                    <div className="max-w-3xl mx-auto text-center mb-8">
                        <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
                        <Skeleton className="h-6 w-2/3 mx-auto" />
                    </div>

                    <div className="max-w-2xl mx-auto">
                        <Skeleton className="h-14 w-full rounded-lg" />

                        <div className="flex flex-wrap gap-2 mt-4">
                            <Skeleton className="h-9 w-28" />
                            <Skeleton className="h-9 w-28" />
                            <Skeleton className="h-9 w-28" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Results Section Skeleton */}
            <section className="py-12">
                <div className="container px-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                        <div>
                            <Skeleton className="h-8 w-48 mb-2" />
                            <Skeleton className="h-5 w-72" />
                        </div>

                        <div className="flex items-center gap-4 mt-4 md:mt-0">
                            <Skeleton className="h-9 w-36" />
                            <Skeleton className="h-9 w-48" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="rounded-lg overflow-hidden border bg-card">
                                <Skeleton className="h-48 w-full" />
                                <div className="p-4">
                                    <Skeleton className="h-6 w-3/4 mb-2" />
                                    <Skeleton className="h-4 w-full mb-2" />
                                    <Skeleton className="h-4 w-2/3 mb-3" />
                                    <Skeleton className="h-4 w-1/2 mb-4" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

