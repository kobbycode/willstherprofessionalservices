import Skeleton from '@/components/Skeleton'

export default function Loading() {
    return (
        <main className="min-h-screen bg-gray-50/50 pb-20">
            <div className="container mx-auto px-4 pt-28 pb-12">
                {/* Breadcrumb Skeleton */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white shadow-sm mb-8">
                    <Skeleton className="h-4 w-32" />
                </div>

                {/* Main Product Section Skeleton */}
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-purple-900/5 border border-purple-50 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                        {/* Image Gallery Skeleton */}
                        <div className="lg:col-span-5 p-4 md:p-8 bg-gray-50/50">
                            <Skeleton className="aspect-square rounded-3xl mb-6 shadow-xl" />
                            <div className="flex gap-3 overflow-x-auto pb-4">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <Skeleton key={i} className="w-20 h-20 flex-shrink-0 rounded-2xl" />
                                ))}
                            </div>
                        </div>

                        {/* Product Detail Content Skeleton */}
                        <div className="lg:col-span-7 p-6 md:p-10 lg:p-12 flex flex-col space-y-8">
                            <div className="space-y-4">
                                <Skeleton className="h-8 md:h-10 lg:h-12 w-3/4 rounded-xl" />
                                <div className="flex items-center gap-6">
                                    <Skeleton className="h-6 w-32 rounded-lg" />
                                    <Skeleton className="h-4 w-40 rounded-xl" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
                                <div className="space-y-6">
                                    <Skeleton className="h-10 w-40" />
                                    <div className="flex gap-4">
                                        <Skeleton className="flex-1 h-14 rounded-2xl" />
                                        <Skeleton className="w-14 h-14 rounded-2xl" />
                                    </div>
                                    <Skeleton className="h-14 w-full rounded-2xl" />
                                </div>
                                <div className="space-y-4">
                                    <Skeleton className="h-full w-full rounded-[2rem] min-h-[200px]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
