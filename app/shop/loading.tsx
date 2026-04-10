import Skeleton from '@/components/Skeleton'
import { Search, ShoppingBag } from 'lucide-react'

export default function Loading() {
    return (
        <main className="min-h-screen bg-[#fafafa] pt-[56px] md:pt-[118px]">
            {/* Hero Section Skeleton */}
            <div className="relative bg-white text-secondary-900 pt-20 pb-20 px-4 overflow-hidden border-b border-gray-100">
                <div className="relative container mx-auto text-center max-w-4xl flex flex-col items-center">
                    <Skeleton className="h-8 w-48 rounded-full mb-6" />
                    <Skeleton className="h-12 w-64 md:w-96 mb-6" />
                    <Skeleton className="h-4 w-full max-w-xl mb-2" />
                    <Skeleton className="h-4 w-3/4 max-w-md" />
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-12 relative z-10 pb-24">
                {/* Search & Filter Bar Skeleton */}
                <div className="bg-white rounded-2xl shadow-xl shadow-secondary-900/5 border border-gray-100 p-4 md:p-5 mb-10">
                    <div className="flex flex-col lg:flex-row gap-4 items-center">
                        <Skeleton className="h-12 flex-1 w-full rounded-xl" />
                        <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto no-scrollbar py-1">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-10 w-24 rounded-lg flex-shrink-0" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results Header Skeleton */}
                <div className="flex justify-between items-center mb-6 px-2">
                    <Skeleton className="h-4 w-32" />
                    <div className="h-px flex-1 bg-gray-100 ml-6 hidden md:block" />
                </div>

                {/* Product Grid Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 p-0">
                            <Skeleton className="aspect-[4/3] w-full rounded-none" />
                            <div className="p-5 space-y-4">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-6 w-1/3" />
                                <div className="flex gap-2 pt-2">
                                    <Skeleton className="flex-1 h-10 rounded-lg" />
                                    <Skeleton className="w-10 h-10 rounded-lg" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}
