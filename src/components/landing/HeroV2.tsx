
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf, Star } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useRouter } from 'next/navigation';

export function HeroV2() {
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
                From Learning to Leading: <span className='text-primary'>Continuous Growth</span> for Your Entire Career.
            </h1>
            <p className="text-body-lead text-muted-foreground max-w-3xl mx-auto text-center">
                Stop chasing one-off courses. Become a Pro Member to get unlimited access to our entire catalog and stay ahead with the skills employers demand, year after year.
            </p>
          </div>

           <div className="mb-12">
              <p className="text-meta text-muted-foreground tracking-widest">IN ASSOCIATION WITH</p>
              <div className="mt-6 flex justify-center items-center gap-12">
                  <div>
                        <Image
                          src="/images/rtmnu-logo.png?v=2"
                          alt="RTMNU Logo"
                          width={70}
                          height={70}
                          className="bg-white p-1 rounded-md"
                      />
                  </div>
                    <div>
                      <Image
                          src="/images/lifelonglearning.png?v=2"
                          alt="Lifelong Learning Logo"
                          width={63}
                          height={63}
                      />
                  </div>
              </div>
          </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Button asChild size="xl" className='w-full sm:w-auto'>
                    <Link href="/membership" onClick={(e) => handleNavigate(e, '/membership')}>
                        {isLoading && <Leaf className="h-5 w-5 mr-2 animate-pulse" />}
                        {isLoading ? "Loading..." : "Become a Pro Member"}
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
