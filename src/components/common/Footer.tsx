
"use client";

import Link from 'next/link';
import { Home, BookOpen, Star, Leaf } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import Image from 'next/image';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/courses', label: 'Courses', icon: BookOpen },
  { href: '/reviews', label: 'Reviews', icon: Star },
];

export function AppFooter() {
  const pathname = usePathname();
  const router = useRouter();
  const [loadingLink, setLoadingLink] = useState<string | null>(null);

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>, href: string, label: string) => {
    e.preventDefault();
    setLoadingLink(label);
    router.push(href);
  };

  return (
    <>
      {/* Mobile App-style Bottom Bar */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 border-t backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
        <nav className="container flex justify-around items-center h-16 px-0">
          {navLinks.map((link) => {
            const isLoading = loadingLink === link.label;
            const isActive = !isLoading && pathname === link.href;

            return (
              <Link
                href={link.href}
                key={link.label}
                onClick={(e) => handleNavigate(e, link.href, link.label)}
                className={cn(
                  'flex flex-col items-center justify-center text-center gap-1 w-full h-full transition-colors',
                  isActive
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground hover:text-primary'
                )}
              >
                {isLoading ? <Leaf className="h-5 w-5 mb-1 animate-spin" /> : <link.icon className="h-5 w-5 mb-1" />}
                <span className="text-caption font-medium">{isLoading ? 'Loading...' : link.label}</span>
              </Link>
            );
          })}
        </nav>
      </footer>

      {/* Desktop Footer */}
      <footer className="hidden md:block bg-muted/30 border-t">
        <div className="container py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <Link href="/" className="flex items-center gap-2">
                  <Image src="/images/sprucelogo.webp" alt="Spruce Lifeskills" width={76} height={76} />
              </Link>
              <p className="text-meta text-muted-foreground mt-1">
                  University-Approved Skill Courses for Career Success.
              </p>
            </div>
            <p className="text-meta text-center md:text-right text-muted-foreground">
              © {new Date().getFullYear()} Spruce Lifeskills. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
