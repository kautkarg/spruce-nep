

import { Header } from "@/components/common/Header";
import { Hero } from "@/components/landing/Hero";
import { TrustSection } from "@/components/landing/AboutUs";
import { EnrollmentForm } from "@/components/landing/EnrollmentForm";
import { Testimonials } from "@/components/landing/Testimonials";
import { AppFooter } from "@/components/common/Footer";
import { Certificate } from "@/components/landing/Certificate";
import { Placements } from "@/components/landing/Placements";
import { getGoogleReviews } from "./actions";
import { Faq } from "@/components/landing/Faq";
import { CourseCatalog } from "@/components/courses/CourseCatalog";


export default async function Home() {
  const reviews = await getGoogleReviews();
  
  const longReviews = reviews.filter(review => review.review.length > 150);
  const homePageReviews = longReviews.slice(0, 7);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Placements />
        <TrustSection />
        <CourseCatalog />
        <Certificate />
        <Testimonials reviews={homePageReviews} />
        <Faq />
        <EnrollmentForm />
      </main>
      <AppFooter />
    </div>
  );
}
