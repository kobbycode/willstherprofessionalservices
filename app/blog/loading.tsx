import Skeleton from '@/components/Skeleton'

export default function Loading() {
    return (
        <div className="min-h-screen bg-[#fafafa]">
            <div className="pt-20">
                {/* Blog Header Skeleton */}
                <div className="bg-white border-b border-gray-100 mt-8">
                    <div className="container-custom px-4 py-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-10 w-64 md:w-80" />
                        </div>
                    </div>
                </div>

                <div className="container-custom px-4 py-8 md:py-12">
                    {/* Search and Categories Skeleton */}
                    <div className="mb-8 md:mb-12">
                        <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-between">
                            <Skeleton className="h-12 w-full md:w-96 rounded-lg" />
                            <div className="flex flex-col sm:flex-row gap-3 items-center w-full md:w-auto">
                                <Skeleton className="h-12 w-full sm:w-40 rounded-lg" />
                                <div className="flex flex-wrap gap-2">
                                    {[...Array(4)].map((_, i) => (
                                        <Skeleton key={i} className="h-10 w-24 rounded-lg" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Featured Post Skeleton */}
                    <div className="mb-12 md:mb-16">
                        <div className="bg-white rounded-2xl shadow-premium overflow-hidden border border-gray-100">
                            <div className="grid lg:grid-cols-2 gap-0">
                                <Skeleton className="h-64 lg:h-[400px] w-full" />
                                <div className="p-6 md:p-8 flex flex-col justify-center gap-4">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-20 w-full" />
                                    <div className="flex justify-between items-center mt-4">
                                        <Skeleton className="h-6 w-24" />
                                        <Skeleton className="h-10 w-32" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Blog Grid Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-premium overflow-hidden border border-gray-100">
                                <Skeleton className="h-56 w-full" />
                                <div className="p-6 flex flex-col gap-4">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-8 w-full" />
                                    <Skeleton className="h-16 w-full" />
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
