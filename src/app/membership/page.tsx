
import { AppFooter } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
            </main>
            <AppFooter />
        </div>
    )
}
