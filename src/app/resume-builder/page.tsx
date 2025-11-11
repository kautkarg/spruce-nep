
import { AppFooter } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import { ResumeBuilder } from "@/components/resume-builder/ResumeBuilder";

export default function ResumeBuilderPage() {
    return (
        <div className="flex flex-col min-h-screen bg-muted/30">
            <Header />
            <main className="flex-grow container py-8 md:py-12">
                <div className="text-center mb-12">
                    <h1 className="text-h1 font-serif">
                        Create Your Professional Resume
                    </h1>
                    <p className="mt-4 text-body-lead text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        Fill in your details below to generate a clean, professional resume on the fly.
                    </p>
                </div>
                <ResumeBuilder />
            </main>
            <AppFooter />
        </div>
    );
}
