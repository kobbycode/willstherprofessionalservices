import Skeleton from '@/components/Skeleton'

export default function Loading() {
    return (
        <main className="min-h-screen bg-white pb-20">
            <div className="pt-20">
                <div className="container-custom px-4 py-8">
                    <div className="flex items-center space-x-4 mb-8">
                        <Skeleton className="h-5 w-32" />
                    </div>
                    
                    <div className="max-w-4xl mx-auto">
                        {/* Header Area */}
                        <div className="text-center space-y-4 mb-10">
                            <Skeleton className="h-4 w-24 mx-auto" />
                            <Skeleton className="h-12 md:h-16 w-3/4 mx-auto" />
                            <div className="flex justify-center gap-4">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>

                        {/* Featured Image */}
                        <Skeleton className="w-full aspect-video rounded-3xl mb-12" />

                        {/* Content Area */}
                        <div className="space-y-6">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-11/12" />
                            <div className="pt-6">
                                <Skeleton className="h-8 w-1/3 mb-4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-4/5" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
