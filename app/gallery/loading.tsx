import Skeleton from '@/components/Skeleton'

export default function Loading() {
    return (
        <main className="min-h-screen bg-[#fafafa]">
            <div className="pt-32 pb-20">
                <div className="container-custom px-4">
                    <div className="text-center mb-12 flex flex-col items-center">
                        <Skeleton className="h-10 w-48 md:w-64 mb-4" />
                        <Skeleton className="h-4 w-full max-w-xl mb-2" />
                        <Skeleton className="h-4 w-3/4 max-w-md" />
                        <div className="w-12 h-0.5 bg-primary-200 mx-auto mt-6 rounded-full" />
                    </div>
                </div>

                <div className="container-custom px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="aspect-square w-full rounded-2xl" />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    )
}
