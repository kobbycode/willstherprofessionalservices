import dynamic from 'next/dynamic'

const CheckoutContent = dynamic(
    () => import('./CheckoutContent'),
    {
        ssr: false,
        loading: () => <CheckoutSkeleton />
    }
)

function CheckoutSkeleton() {
    return (
        <main className="min-h-screen bg-[#F8FAFC] pt-[56px] md:pt-[110px] pb-12">
            <div className="container-custom py-4 md:py-6 animate-pulse">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-4 w-16 bg-[#E2E8F0]" />
                    <div className="h-4 w-px bg-[#E2E8F0]" />
                    <div className="h-4 w-24 bg-[#E2E8F0]" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
                    <div className="lg:col-span-7">
                        <div className="bg-white shadow-sm border border-[#E2E8F0] p-4 md:p-6 space-y-5">
                            <div className="h-5 w-40 bg-[#F1F5F9]" />
                            <div className="h-3 w-56 bg-[#F1F5F9]" />
                            <div className="h-10 w-full bg-[#F1F5F9]" />
                            <div className="grid grid-cols-2 gap-4">
                                <div className="h-10 w-full bg-[#F1F5F9]" />
                                <div className="h-10 w-full bg-[#F1F5F9]" />
                            </div>
                            <div className="h-16 w-full bg-[#F1F5F9]" />
                            <div className="space-y-3">
                                <div className="h-14 w-full bg-[#F1F5F9]" />
                                <div className="h-14 w-full bg-[#F1F5F9]" />
                                <div className="h-14 w-full bg-[#F1F5F9]" />
                            </div>
                            <div className="h-12 w-full bg-[#2563EB]/20" />
                        </div>
                    </div>
                    <div className="lg:col-span-5">
                        <div className="bg-white shadow-sm border border-[#E2E8F0] p-4 md:p-6 space-y-4">
                            <div className="h-4 w-32 bg-[#F1F5F9]" />
                            <div className="flex gap-3">
                                <div className="w-14 h-14 bg-[#F1F5F9]" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 w-3/4 bg-[#F1F5F9]" />
                                    <div className="h-3 w-1/4 bg-[#F1F5F9]" />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-14 h-14 bg-[#F1F5F9]" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 w-3/4 bg-[#F1F5F9]" />
                                    <div className="h-3 w-1/4 bg-[#F1F5F9]" />
                                </div>
                            </div>
                            <div className="border-t border-[#E2E8F0] pt-3 space-y-2">
                                <div className="h-3 w-full bg-[#F1F5F9]" />
                                <div className="h-3 w-full bg-[#F1F5F9]" />
                                <div className="h-4 w-full bg-[#F1F5F9]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default function CheckoutPage() {
    return <CheckoutContent />
}
