
import { Header } from "@/components/common/Header";
import { HeroV2 } from "@/components/landing/HeroV2";
import { TrustSection } from "@/components/landing/AboutUs";
import { EnrollmentForm } from "@/components/landing/EnrollmentForm";
import { Testimonials } from "@/components/landing/Testimonials";
import { AppFooter } from "@/components/common/Footer";
import { Certificate } from "@/components/landing/Certificate";
import { Placements } from "@/components/landing/Placements";
import { getGoogleReviews } from "../actions";
import { Faq } from "@/components/landing/Faq";
import { MembershipTeaser } from "@/components/landing/MembershipTeaser";


export default async function HomeV2() {
  const reviews = await getGoogleReviews();
  
  const longReviews = reviews.filter(review => review.review.length > 150);
  const homePageReviews = longReviews.slice(0, 7);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <HeroV2 />
        <Placements />
        <TrustSection />
        <MembershipTeaser />
        <Certificate />
        <Testimonials reviews={homePageReviews} />
        <Faq />
        <EnrollmentForm />
      </main>
      <AppFooter />
    </div>
  );
}
