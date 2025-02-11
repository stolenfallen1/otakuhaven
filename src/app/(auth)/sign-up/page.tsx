"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SignUp() {
    const router = useRouter();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>("");

    async function onRegister(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            confirmPassword: formData.get("confirmPassword") as string,
        }

        if (data.password !== data.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                }),
            });

            const response = await res.json();
            if (!res.ok) {
                throw new Error(response.message);
            }

            router.push("/sign-in");

        } catch(error: any) {
            setError(error.message || "Something went wrong");
        } finally {
            setLoading(false);
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
                    {error}
                </div>
            )}
            <form onSubmit={onRegister} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-foreground">
                        Full Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        className="w-full px-3 py-2 border rounded-md bg-background text-foreground border-border focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        required
                    />
                </div>
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
                <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        className="w-full px-3 py-2 border rounded-md bg-background text-foreground border-border focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        required
                    />
                </div>
                <Button 
                    type="submit" 
                    className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
                    disabled={loading}
                >
                    {loading ? "Signing up..." : "Sign Up"}
                </Button>
            </form>
        </div>
    );
}