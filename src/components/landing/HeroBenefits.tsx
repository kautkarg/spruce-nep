
"use client";

import { Award, GraduationCap, Briefcase, Users } from "lucide-react";

const benefits = [
    {
        icon: GraduationCap,
        title: "Graduate with an Advantage",
        description: "Earn official RTMNU credits that fulfill NEP 2020 requirements and make your degree more powerful.",
    },
    {
        icon: Award,
        title: "Get a University Certificate",
        description: "Receive a verified certificate from a public state university—a real academic credential for your resume.",
    },
    {
        icon: Briefcase,
        title: "Start Your Career Sooner",
        description: "Our 'Campus to Corporate' program gives you a direct path to job interviews and placement support.",
    },
    {
        icon: Users,
        title: "Learn from Industry Experts",
        description: "Gain relevant, job-ready skills from professionals who practice what they teach.",
    },
];

export function HeroBenefits() {
    return (
        <section className="py-20 md:py-28 bg-muted/30 border-y">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 max-w-7xl mx-auto">
                    {benefits.map((benefit, index) => (
                        <div 
                            key={index}
                            className="text-left"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <benefit.icon className="w-6 h-6 text-primary flex-shrink-0" />
                                <h3 className="text-h4 font-semibold text-foreground">{benefit.title}</h3>
                            </div>
                            <p className="text-body text-muted-foreground leading-relaxed">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
