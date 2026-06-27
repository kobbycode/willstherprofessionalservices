import Skeleton from '@/components/Skeleton'

export default function Loading() {
    return (
        <main className="min-h-screen bg-[#F8FAFC] pt-[56px] md:pt-[110px]">
            <div className="container-custom py-6 md:py-10">
                <Skeleton className="h-4 w-48 rounded-lg mb-6" />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                    <div className="lg:col-span-6">
                        <Skeleton className="aspect-square rounded-xl" />
                        <div className="flex gap-2 mt-3">
                            {[1, 2, 3, 4].map(i => (
                                <Skeleton key={i} className="w-16 h-16 rounded-lg" />
                            ))}
                        </div>
                    </div>
                    <div className="lg:col-span-6 space-y-4">
                        <Skeleton className="h-4 w-24 rounded" />
                        <Skeleton className="h-8 w-3/4 rounded-lg" />
                        <Skeleton className="h-7 w-32 rounded-lg" />
                        <div className="space-y-2 pt-4">
                            <Skeleton className="h-4 w-full rounded" />
                            <Skeleton className="h-4 w-full rounded" />
                            <Skeleton className="h-4 w-2/3 rounded" />
                        </div>
                        <div className="pt-4 space-y-3">
                            <Skeleton className="h-12 w-full rounded-xl" />
                            <Skeleton className="h-12 w-full rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
