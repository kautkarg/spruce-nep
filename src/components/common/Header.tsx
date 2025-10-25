
"use client";

import Link from 'next/link';
import { Menu, X, ArrowRight, Leaf, LogOut, UserCircle, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';
import { useFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';


const navLinks = [
    { href: '/courses', label: 'Courses' },
    { href: '/reviews', label: 'Reviews' },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { user, isUserLoading, auth } = useFirebase();

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setIsLoading(true);
      router.push(href);
  };

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/');
    }
  };

  const UserMenu = () => {
    if (isUserLoading) {
      return <Leaf className="h-6 w-6 animate-spin" />;
    }

    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                <AvatarFallback>
                  <UserCircle />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.displayName || 'Welcome'}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <Button asChild variant="outline">
        <Link href="/login">
          Login
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    )
  }

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
                                 {user && (
                                  <li><SheetClose asChild><Link href="/dashboard" className='block text-body-lead font-semibold p-2 rounded-md hover:bg-muted leading-relaxed'>Dashboard</Link></SheetClose></li>
                                )}
                            </ul>
                            </nav>
                            <div className="mt-auto p-6 border-t bg-muted/50">
                                {user ? (
                                   <Button onClick={handleSignOut} size="lg" className="w-full">
                                    Sign Out
                                  </Button>
                                ) : (
                                  <Button asChild size="lg" className="w-full">
                                      <Link href="/login">
                                          {isLoading && <Leaf className="mr-2 h-4 w-4 animate-spin" />}
                                          {isLoading ? 'Loading...' : 'Login / Sign Up'}
                                      </Link>
                                  </Button>
                                )}
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="flex items-center justify-end">
                <UserMenu />
            </div>
        </div>
      </div>
    </header>
  );
}
