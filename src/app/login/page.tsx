
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';

import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.012,35.846,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
  </svg>
);

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';
  const auth = getAuth();
  const { user, isUserLoading } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push(redirectUrl);
    }
  }, [user, isUserLoading, router, redirectUrl]);

  const handleSuccessfulSignIn = () => {
    toast({
      title: 'Just like magic!',
      description: "You're signed in and ready to go.",
    });
    router.push(redirectUrl);
  }

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // The useEffect will handle redirection.
    } catch (error: any) {
        if (error.code === 'auth/popup-closed-by-user') {
            toast({
                variant: 'destructive',
                title: 'Looks like the window was closed!',
                description: 'The Google sign-in window was closed before finishing. Want to give it another go?',
            });
        } else {
            toast({
                variant: 'destructive',
                title: 'Oops! Google sign-in hiccup.',
                description: 'Something went wrong on our end. Could you try that again?',
            });
        }
    }
  };
  
  const handleEmailSignIn = async ({ email, password }: z.infer<typeof formSchema>) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The useEffect will handle redirection.
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        toast({
          variant: 'destructive',
          title: 'Hmm, that combo didn\'t work.',
          description: 'That email and password don\'t match our records. Please try again!',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Sign-in failed!',
          description: 'Something went a bit sideways. Please check your details and try again.',
        });
      }
    }
  };

  const handleEmailSignUp = async ({ email, password }: z.infer<typeof formSchema>) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
       // The useEffect will handle redirection.
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        toast({
          variant: 'destructive',
          title: 'You\'re already one of us!',
          description: 'An account with this email already exists. Try signing in instead!',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Signup Glitch!',
          description: 'We couldn\'t create your account right now. Please try again in a bit.',
        });
      }
    }
  };

  const handlePasswordReset = async () => {
    const email = form.getValues('email');
    if (!email) {
      form.setError('email', { type: 'manual', message: 'Please pop in your email address first!' });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: 'Check your inbox!',
        description: 'If an account exists for that email, a password reset link is on its way. Be sure to check your spam folder!',
      });
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        toast({
          variant: 'destructive',
          title: 'No account found!',
          description: 'We couldn\'t find an account with that email. Maybe try a different one?',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Oh no, a sending error!',
          description: "We couldn't send the reset email right now. Please try again in a bit.",
        });
      }
    }
  };

  if (isUserLoading || user) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Student Portal</CardTitle>
          <CardDescription>Sign in or create an account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
              <GoogleIcon className="mr-2 h-5 w-5" />
              Sign in with Google
            </Button>
            <div className="flex items-center">
              <Separator className="flex-1" />
              <span className="mx-4 text-xs text-muted-foreground">OR CONTINUE WITH</span>
              <Separator className="flex-1" />
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleEmailSignIn)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@awesome.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <Button
                          type="button"
                          variant="link"
                          className="p-0 h-auto text-xs"
                          onClick={handlePasswordReset}
                        >
                          Forgot Password?
                        </Button>
                      </div>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
                <Button type="button" variant="secondary" className="w-full" onClick={form.handleSubmit(handleEmailSignUp)}>
                  Create Account
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
