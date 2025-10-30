
import { AppFooter } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const membershipBenefits = [
  "Access to all current and future courses",
  "Exclusive workshops with industry experts",
  "Priority job placement support",
  "Verified membership certificate",
  "Access to a private student community",
];

const PlanCard = ({ plan, price, billingCycle, cta, isBestValue }: { plan: string, price: string, billingCycle: string, cta: string, isBestValue?: boolean }) => (
    <div className="flex flex-col h-full">
        <div className="mb-8 flex-grow">
            <p className="text-5xl font-bold">{price}<span className="text-lg font-normal text-muted-foreground">/{billingCycle}</span></p>
            <p className="text-meta text-muted-foreground mt-1">{plan} plan</p>
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

        <div className="mt-auto">
            <Button size="xl" className="w-full" asChild>
                <Link href="/membership?action=checkout">
                    {cta}
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
        </div>
    </div>
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

                    <div className="max-w-lg mx-auto">
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
                                <Tabs defaultValue="annual" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 mb-8 h-auto">
                                        <TabsTrigger value="monthly" className="py-2.5 text-meta">Monthly</TabsTrigger>
                                        <TabsTrigger value="annual" className="py-2.5 text-meta relative">
                                            Annual
                                            <Badge variant="destructive" className="absolute -top-2 -right-3 text-xs scale-90">Best Value</Badge>
                                        </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="monthly">
                                        <PlanCard 
                                            plan="Billed monthly"
                                            price="₹599"
                                            billingCycle="month"
                                            cta="Start Monthly Subscription"
                                        />
                                    </TabsContent>
                                    <TabsContent value="annual">
                                         <PlanCard 
                                            plan="Billed annually"
                                            price="₹4999"
                                            billingCycle="year"
                                            cta="Start Annual Subscription"
                                            isBestValue
                                        />
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                             <CardFooter className="p-8 border-t bg-muted/50 text-center flex-col">
                                <div className="flex items-center justify-center gap-2 text-muted-foreground text-caption">
                                    <ShieldCheck className="h-4 w-4 text-green-600" />
                                    <span>30-Day Money-Back Guarantee. Cancel anytime.</span>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </main>
            <AppFooter />
        </div>
    )
}
