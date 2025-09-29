import { AppFooter } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import { StudentReviews } from "@/components/reviews/StudentReviews";
import { getGoogleReviews } from "@/app/actions";

export default async function ReviewsPage() {
    const reviews = await getGoogleReviews();

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-grow">
                <section className="py-16 md:py-20">
                    <div className="container text-center pb-12 md:pb-16">
                        <h1 className="text-h1 font-serif">
                            Straight from the Source
                        </h1>
                        <p className="mt-4 text-body-lead text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                           Hear what our students have to say about their journey and success with Spruce Lifeskills.
                        </p>
                    </div>
                    <div className="container">
                        <StudentReviews reviews={reviews} />
                    </div>
                </section>
            </main>
            <AppFooter />
        </div>
    )
}
