
"use client";

import { Check, Star, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";

const benefits = [
    "Unlimited access to ALL current and future courses",
    "Exclusive workshops and live sessions with industry experts",
    "Priority 'Campus to Corporate' job placement support",
    "A verified Pro Member certificate to boost your resume",
];

export function MembershipTeaser() {
    return (
        <section id="membership-teaser" className="bg-muted/30 border-y py-20 md:py-28">
            <div className="container">
                <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center max-w-6xl mx-auto">
                    <div className="space-y-6">
                        <span className="text-caption font-semibold uppercase text-primary tracking-widest">PRO MEMBERSHIP</span>
                        <h2 className="font-serif">
                            The Smartest Way to Build Your Career
                        </h2>
                        <p className="text-body-lead text-muted-foreground leading-relaxed">
                            Why buy one course when you can get them all? The Pro Membership is your all-access pass to continuous learning, ensuring you always have the most in-demand skills.
                        </p>
                        <ul className="space-y-4">
                            {benefits.map((benefit, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                                        <Check className="w-4 h-4 text-primary-foreground" />
                                    </div>
                                    <span className="text-body-lead text-foreground/90">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                         <Button size="xl" asChild>
                            <Link href="/membership">
                                Explore Pro Membership
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                     <Card className="shadow-lg border-2 border-primary relative -rotate-1 hover:rotate-0 transition-transform">
                        <CardHeader className="p-8">
                            <Star className="w-10 h-10 text-yellow-400 fill-yellow-400 mb-4" />
                            <CardTitle className="font-serif">
                                Pro Annual Plan
                            </CardTitle>
                            <CardDescription className="text-body-lead">
                                The ultimate investment for unstoppable career growth.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                            <div className="mb-8">
                                <p className="text-5xl font-bold">₹4999<span className="text-lg font-normal text-muted-foreground">/year</span></p>
                                <p className="text-meta text-muted-foreground mt-1">Billed annually</p>
                            </div>
                            <p className="text-body text-muted-foreground">
                                Includes all benefits, full access to our entire course library, and automatic enrollment in all future courses.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
