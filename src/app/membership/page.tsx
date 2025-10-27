
import { AppFooter } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, ArrowRight } from "lucide-react";
import Link from "next/link";

const membershipBenefits = [
  "Access to all current and future courses",
  "Exclusive workshops with industry experts",
  "Priority job placement support",
  "Verified membership certificate",
  "Access to a private student community",
];

export default function MembershipPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-grow py-20 md:py-28">
                <div className="container">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                         <span className="text-caption font-semibold uppercase text-primary tracking-widest">BECOME A MEMBER</span>
                        <h1 className="mt-4 font-serif">
                            Unlock Your Full Potential
                        </h1>
                        <p className="mt-6 text-body-lead text-muted-foreground leading-relaxed">
                            Join the Spruce Lifeskills membership to get unlimited access to all courses, exclusive content, and dedicated career support. It's the ultimate investment in your future.
                        </p>
                    </div>

                    <div className="max-w-md mx-auto">
                        <Card className="shadow-lg border-2 border-primary/20 relative overflow-hidden">
                            <CardHeader className="p-8">
                                <CardTitle className="text-primary font-serif">
                                    Pro Membership
                                </CardTitle>
                                <CardDescription className="text-body-lead">
                                    Everything you need to get ahead, all in one place.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 pt-0">
                               <div className="mb-8">
                                    <p className="text-5xl font-bold">₹499<span className="text-lg font-normal text-muted-foreground">/month</span></p>
                                    <p className="text-meta text-muted-foreground mt-1">Billed annually, or ₹599 billed monthly.</p>
                               </div>

                                <ul className="space-y-4">
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
                                        Join the Membership
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </main>
            <AppFooter />
        </div>
    )
}
