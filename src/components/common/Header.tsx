
"use client";

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const navLinks = [
    { href: '/courses', label: 'Courses' },
    { href: '/reviews', label: 'Reviews' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="container flex h-20 items-center">
        <div className="flex items-center md:flex-1">
          <Link href="/" className="flex items-center gap-2">
             <Image src="/images/sprucelogo.webp" alt="Spruce Lifeskills" width={76} height={76} />
          </Link>
        </div>
        
        <nav className="hidden md:flex flex-1 items-center justify-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-meta transition-colors hover:text-foreground',
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-end flex-1 gap-4">
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Open Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className='w-full max-w-sm p-0'>
                    <SheetHeader className="p-6 border-b">
                        <SheetTitle asChild>
                        <Link href="/" className="flex items-center gap-3">
                            <Image src="/images/sprucelogo.webp" alt="Spruce Lifeskills" width={76} height={76} />
                        </Link>
                        </SheetTitle>
                    </SheetHeader>
                        <div className="flex flex-col h-full">
                            <nav className='flex-grow p-6'>
                            <ul className='space-y-4'>
                                <li><SheetClose asChild><Link href="/courses" className='block text-body-lead font-semibold p-2 rounded-md hover:bg-muted leading-relaxed'>Courses</Link></SheetClose></li>
                                <li><SheetClose asChild><Link href="/reviews" className='block text-body-lead font-semibold p-2 rounded-md hover:bg-muted leading-relaxed'>Reviews</Link></SheetClose></li>
                            </ul>
                            </nav>
                             <div className="p-6 border-t">
                                <Button asChild className="w-full">
                                    <Link href="#enroll">
                                        Enroll Now
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="hidden md:flex items-center justify-end gap-4">
                <Button asChild>
                    <Link href="#enroll">
                        Enroll Now
                    </Link>
                </Button>
            </div>
        </div>
      </div>
    </header>
  );
}
