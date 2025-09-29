import { AppFooter } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import { BatchList } from "@/components/batches/BatchList";

export default function BatchesPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-grow">
                <section className="py-16 md:py-20">
                    <div className="container text-center pb-12 md:pb-16">
                        <h3 className="text-h3 font-serif">
                            Live & Upcoming Batches
                        </h3>
                        <p className="mt-4 text-body-lead text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            Find the perfect schedule for your skill development journey. Enroll today to secure your spot.
                        </p>
                    </div>
                    <div className="container">
                        <BatchList />
                    </div>
                </section>
            </main>
            <AppFooter />
        </div>
    )
}
