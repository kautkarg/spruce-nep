
"use client";

import { AppFooter } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import { useIsMobile } from "@/hooks/use-mobile";

const ResumeBuilder = dynamic(() => import('@/components/resume-builder/ResumeBuilder').then(mod => mod.ResumeBuilder), {
    ssr: false,
    loading: () => <ResumeBuilderSkeleton />,
});

function ResumeBuilderSkeleton() {
    const isMobile = useIsMobile();
    return (
        <div className="container mx-auto py-8 md:py-12 px-4">
            <div className={isMobile ? "space-y-6" : "grid grid-cols-1 lg:grid-cols-12 gap-8"}>
                <div className={isMobile ? "space-y-6" : "lg:col-span-5 xl:col-span-4 space-y-6"}>
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
                {!isMobile && (
                    <div className="lg:col-span-7 xl:col-span-8">
                        <Skeleton className="w-full aspect-[8.5/11]" />
                    </div>
                )}
            </div>
        </div>
    )
}

export default function ResumeBuilderPage() {
    return (
        <div className="flex flex-col min-h-screen bg-muted/30">
            <Header />
            <main className="flex-grow container mx-auto py-8 md:py-12 px-4">
                <div className="text-center mb-12">
                    <h1 className="text-h1 font-serif">
                        Build Your Professional Resume
                    </h1>
                    <p className="mt-4 text-body-lead text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        Fill in your details below, step-by-step, to generate a clean, professional resume. Your progress is saved automatically.
                    </p>
                </div>
                <ResumeBuilder />
            </main>
            <AppFooter />
        </div>
    );
}
