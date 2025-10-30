
import { AppFooter } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowRight, ShieldCheck, Quote } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getGoogleReviews } from "../actions";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { membershipFaqs } from "@/lib/membership-faq";


const membershipBenefits = [
  "Access to all current and future courses",
  "Exclusive workshops with industry experts",
  "Priority job placement support",
  "Verified membership certificate",
  "Access to a private student community",
];

const PlanCard = ({ plan, price, billingCycle, cta, isBestValue, className }: { plan: string, price: string, billingCycle: string, cta: string, isBestValue?: boolean, className?: string }) => (
    <Card className={cn("shadow-lg flex flex-col h-full", className)}>
        {isBestValue && (
            <Badge variant="destructive" className="absolute -top-3 right-6 text-sm">Best Value</Badge>
        )}
        <CardHeader className="p-8">
            <CardTitle className="font-serif">
                {plan}
            </CardTitle>
            <CardDescription className="text-body-lead">
                {isBestValue ? "The ultimate career investment." : "Flexible, pay-as-you-go access."}
            </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0 flex-grow">
            <div className="mb-8">
                <p className="text-5xl font-bold">{price}<span className="text-lg font-normal text-muted-foreground">/{billingCycle}</span></p>
                <p className="text-meta text-muted-foreground mt-1">{isBestValue ? "Billed annually" : "Billed monthly"}</p>
            </div>

            <ul className="space-y-4 mb-8">
                {membershipBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                            <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <span className="text-body-lead text-foreground/90">{benefit}</span>
                    </li>
                ))}
            </ul>
        </CardContent>
        <CardFooter className="p-8 border-t bg-muted/50">
            <Button size="xl" className="w-full" asChild>
                <Link href="/membership?action=checkout">
                    {cta}
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
        </CardFooter>
    </Card>
);


export default async function MembershipPage() {
    const reviews = await getGoogleReviews();
    const featuredReviews = reviews.filter(r => r.review.length > 100).slice(0, 3);
    
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-grow">
                <section className="py-20 md:py-28">
                    <div className="container">
                        <div className="max-w-3xl mx-auto text-center mb-16">
                            <span className="text-caption font-semibold uppercase text-primary tracking-widest">PRO MEMBERSHIP</span>
                            <h1 className="mt-4 font-serif">
                                Your Lifelong Career Partner
                            </h1>
                            <p className="mt-6 text-body-lead text-muted-foreground leading-relaxed">
                                Join the Spruce Lifeskills membership to get unlimited access to all courses, exclusive content, and dedicated career support. It's the ultimate investment in your future.
                            </p>
                        </div>

                        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            <PlanCard 
                                plan="Pro Membership (Monthly)"
                                price="₹599"
                                billingCycle="month"
                                cta="Start Monthly Subscription"
                            />
                            <PlanCard 
                                plan="Pro Membership (Annual)"
                                price="₹4999"
                                billingCycle="year"
                                cta="Start Annual Subscription"
                                isBestValue
                                className="border-2 border-primary relative"
                            />
                        </div>
                        <div className="text-center mt-16">
                            <div className="inline-flex items-center justify-center gap-2 text-muted-foreground text-caption border rounded-full p-2 px-4">
                                <ShieldCheck className="h-4 w-4 text-green-600" />
                                <span>30-Day Money-Back Guarantee. Cancel anytime.</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="member-testimonials" className="bg-muted/30 border-y py-20 md:py-28">
                    <div className="container">
                        <div className="mb-16 max-w-4xl mx-auto text-center">
                            <h2 className="font-serif">
                                What Our Members Say
                            </h2>
                            <p className="mt-6 text-body-lead text-muted-foreground leading-relaxed">
                                Real stories from members who have accelerated their careers with a Spruce Lifeskills Pro Membership.
                            </p>
                        </div>
                        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredReviews.map((review, index) => (
                                <Card key={index} className="relative p-8 break-inside-avoid border-2 border-primary/10 bg-background/50 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 h-full flex flex-col group">
                                    <Quote className="absolute top-6 right-6 h-16 w-16 text-primary/5 transition-transform duration-300 group-hover:scale-110" />
                                    <CardHeader className="p-0 mb-4 z-10">
                                        <CardTitle className="text-primary">{review.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0 z-10 flex-grow">
                                        <blockquote className="text-body-lead text-foreground/80 leading-relaxed">
                                            “{review.review}”
                                        </blockquote>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="membership-faq" className="py-20 md:py-28 bg-background">
                    <div className="container max-w-4xl mx-auto">
                        <div className="mb-16 text-center">
                            <h2 className="text-h2 font-serif">
                                Your Questions, Answered
                            </h2>
                            <p className="mt-6 text-body-lead text-muted-foreground leading-relaxed">
                                Everything you need to know about becoming a Spruce Lifeskills Pro Member.
                            </p>
                        </div>

                        <Accordion type="single" collapsible className="w-full">
                            {membershipFaqs.map((faq, index) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                    <AccordionTrigger className="text-left text-body-lead font-semibold leading-relaxed hover:no-underline">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-body-lead text-muted-foreground leading-relaxed pt-2">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </section>

            </main>
            <AppFooter />
        </div>
    )
}
