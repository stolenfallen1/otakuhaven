"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function SignIn() {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>("");
    const [needsVerification, setNeedsVerification] = React.useState<boolean>(false);
    const [userEmail, setUserEmail] = React.useState<string>("");
    const [resendLoading, setResendLoading] = React.useState<boolean>(false);
    const [resendSuccess, setResendSuccess] = React.useState<boolean>(false);
    const { toast } = useToast();
    const router = useRouter();

    async function onLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setNeedsVerification(false); 

        const formData = new FormData(e.currentTarget);
        const data = {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
        }

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const response = await res.json();
            if (!res.ok) {
                if (response.isVerified === false && response.canResend) {
                    setNeedsVerification(true);
                    setUserEmail(response.email);
                }
                throw new Error(response.message);
            }

            localStorage.setItem("token", response.token);

            toast({
                variant: "success",
                title: "Success",
                description: "Welcome to OtakuHaven",
                duration: 1000,
            });

            const searchParams = new URLSearchParams(window.location.search);
            const returnTo = searchParams.get('returnTo') || '/';
            
            router.push(decodeURIComponent(returnTo));
            router.refresh();


        } catch(error: any) {
            setError(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }
    
    async function resendVerification() {
        if (resendLoading || resendSuccess) return;
        setResendLoading(true);
        
        try {
            const res = await fetch('/api/auth/resend-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            
            setResendSuccess(true);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setResendLoading(false);
        }
    }

    return (
        <div className="container mx-auto max-w-md px-4 py-16">
            <section className="text-center pb-6">    
                <Link href="/" className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    OtakuHaven
                </Link>
            </section>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p>{error}</p>
                    {needsVerification && (
                        <button
                            onClick={resendVerification}
                            disabled={resendLoading || resendSuccess}
                            className={`${
                                resendSuccess 
                                    ? 'text-green-700 cursor-default' 
                                    : resendLoading
                                        ? 'text-gray-500 cursor-not-allowed'
                                        : 'underline text-blue-800 hover:text-blue-600'
                            }`}
                        >
                            {resendLoading 
                                ? 'Sending...' 
                                : resendSuccess 
                                    ? 'Email sent! Check your inbox please' 
                                    : 'Resend verification email'
                            }
                        </button>
                    )}
                </div>
            )}
            <form onSubmit={onLogin} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        className="w-full px-3 py-2 border rounded-md bg-background text-foreground border-border focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-foreground">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        className="w-full px-3 py-2 border rounded-md bg-background text-foreground border-border focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        required
                    />
                </div>
                <Button 
                    type="submit" 
                    className="w-full text-md bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
                    disabled={loading}
                >
                    {loading ? "Signing in..." : "Sign In"}
                </Button>
            </form>
        </div>
    );
}