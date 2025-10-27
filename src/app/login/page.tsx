
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useFirebase } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf } from 'lucide-react';
import Image from 'next/image';

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" {...props}>
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.804 8.841C34.524 4.952 29.544 2.5 24 2.5C11.411 2.5 2.5 11.411 2.5 24S11.411 45.5 24 45.5s21.5-8.911 21.5-21.5c0-1.493-.139-2.951-.389-4.417z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691c2.128-3.722 5.923-6.425 10.334-7.691l-4.521-7.234C8.232 2.316 4.386 5.823 2.158 10.435L6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 45.5c5.441 0 10.237-1.933 13.791-5.111L31.696 34.78c-2.383 1.637-5.352 2.622-8.696 2.622c-5.223 0-9.66-3.344-11.303-7.962H3.146v4.869c3.435 7.02 10.594 11.191 18.854 11.191L24 45.5z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H24v8h11.303c-.792 2.237-2.231 4.16-4.087 5.571l5.443 4.356c3.155-2.936 5.347-7.232 5.347-12.022c0-1.493-.139-2.951-.389-4.417z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const { auth, user, isUserLoading } = useFirebase();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Let the useEffect handle the redirect
    } catch (error) {
      console.error('Error during Google sign-in:', error);
    }
  };

  if (isUserLoading || user) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Leaf className="h-32 w-32 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-muted/30 p-4">
       <div className="mb-8">
            <a href="/" className="flex items-center gap-2">
                <Image src="/images/sprucelogo.webp" alt="Spruce Lifeskills" width={76} height={76} />
            </a>
        </div>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="font-serif">Welcome Back</CardTitle>
          <CardDescription>Sign in to access your student dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full h-12 text-body-lead"
            onClick={handleSignInWithGoogle}
          >
            <GoogleIcon className="mr-3 h-5 w-5" />
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
       <p className="mt-8 text-center text-sm text-muted-foreground">
        Explore our programs. <a href="/" className="underline hover:text-primary">Return to homepage</a>.
      </p>
    </div>
  );
}
