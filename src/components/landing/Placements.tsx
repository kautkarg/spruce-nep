
import Image from "next/image";
import { cn } from "@/lib/utils";

const companies = [
    { name: 'Access', logo: '/images/recruiters/access.png?v=2' },
    { name: 'TCS', logo: '/images/recruiters/tcs.png?v=2' },
    { name: 'Gebbs', logo: '/images/recruiters/gebbs.png?v=2' },
    { name: 'Advantmed', logo: '/images/recruiters/advantmed.png?v=2' },
    { name: 'GMC', logo: '/images/recruiters/gmc.jpg?v=2' },
    { name: 'Alkspzant', logo: '/images/recruiters/alkapzant.jpg?v=2' },
    { name: 'Cognizant', logo: '/images/recruiters/cognizant.png?v=2' },
    { name: 'Iqvia', logo: '/images/recruiters/iqvia.png?v=2' },
    { name: 'Ascent', logo: '/images/recruiters/ascent.png?v=2' },
    { name: 'Corro', logo: '/images/recruiters/corro.png?v=2' },
    { name: 'Meditrina', logo: '/images/recruiters/meditrina.png?v=2' },
    { name: 'EPI', logo: '/images/recruiters/epi.jpg?v=2' },
    { name: 'NG', logo: '/images/recruiters/ng.png?v=2' },
    { name: 'Augustus', logo: '/images/recruiters/augustus.jpg?v=2' },
    { name: 'Avontix', logo: '/images/recruiters/avontix.png?v=2' },
    { name: 'KIMS', logo: '/images/recruiters/kims.jpg?v=2' },
];

export function Placements() {
    return (
        <section id="placements" className="bg-muted/30 py-16">
            <div className="container">
                <div className="flex flex-col items-center gap-8">
                    <p className="font-semibold text-meta tracking-widest text-muted-foreground text-center">
                        OUR STUDENTS ARE PLACED AT
                    </p>
                     <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                        <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 animate-scroll">
                            {companies.map((company, index) => (
                                <li key={index} className="relative h-20 w-40">
                                    <Image
                                        src={company.logo}
                                        alt={company.name}
                                        fill
                                        sizes="(max-width: 768px) 33vw, 20vw"
                                        className="object-contain"
                                    />
                                </li>
                            ))}
                        </ul>
                         <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 animate-scroll" aria-hidden="true">
                            {companies.map((company, index) => (
                                <li key={index} className="relative h-20 w-40">
                                    <Image
                                        src={company.logo}
                                        alt={company.name}
                                        fill
                                        sizes="(max-width: 768px) 33vw, 20vw"
                                        className="object-contain"
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
