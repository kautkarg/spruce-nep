
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf, Star } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useRouter } from 'next/navigation';

export function Hero() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        setIsLoading(true);
        router.push(href);
    };

  return (
    <section id="home" className="w-full relative bg-background overflow-hidden">
       <div
        aria-hidden="true"
        className="absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(circle at top left, hsl(200 80% 90%), transparent 40%), radial-gradient(circle at bottom right, hsl(40 80% 90%), transparent 40%)'
        }}
      />
      <div className="relative z-10 container text-center pt-28 pb-20 md:pb-28">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="mb-6 max-w-3xl mx-auto font-serif text-center">
                Without <span className="text-primary">Skills</span>, Your <span className="text-primary">Degree</span> Is Not Enough Anymore.
            </h1>
            <p className="text-body-lead text-muted-foreground max-w-3xl mx-auto text-center">
                Launch your career with industry-relevant skill based courses in accordance with NEP 2020 that give you official academic credits and an unfair advantage in the job market.
            </p>
          </div>

           <div className="mb-12">
              <p className="text-meta text-muted-foreground tracking-widest">IN ASSOCIATION WITH</p>
              <div className="mt-6 flex justify-center items-center gap-12">
                  <div>
                        <Image
                          src="/images/rtmnu-logo.png"
                          alt="RTMNU Logo"
                          width={70}
                          height={70}
                          className="bg-white p-1 rounded-md"
                      />
                  </div>
                    <div>
                      <Image
                          src="/images/lifelonglearning.png"
                          alt="Lifelong Learning Logo"
                          width={63}
                          height={63}
                      />
                  </div>
              </div>
          </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Button asChild size="xl" className='w-full sm:w-auto'>
                    <Link href="/courses" onClick={(e) => handleNavigate(e, '/courses')}>
                        {isLoading && <Leaf className="h-5 w-5 mr-2 animate-pulse" />}
                        {isLoading ? "Loading..." : "View All Courses"}
                        {!isLoading && <ArrowRight className="h-5 w-5 ml-2" />}
                    </Link>
                </Button>
                <div className="flex items-center justify-center gap-4">
                    <div className="flex -space-x-2 overflow-hidden">
                        <Avatar className="inline-block border-2 border-background h-8 w-8">
                            <AvatarImage src="https://picsum.photos/seed/avatar1/40/40" />
                            <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                         <Avatar className="inline-block border-2 border-background h-8 w-8">
                            <AvatarImage src="https://picsum.photos/seed/avatar2/40/40" />
                            <AvatarFallback>B</AvatarFallback>
                        </Avatar>
                         <Avatar className="inline-block border-2 border-background h-8 w-8">
                            <AvatarImage src="https://picsum.photos/seed/avatar3/40/40" />
                            <AvatarFallback>C</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className='flex flex-col items-start'>
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                        <p className="text-meta text-muted-foreground mt-1">Trusted by 1000+ students</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
