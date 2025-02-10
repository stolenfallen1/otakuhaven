"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SignIn() {
    const router = useRouter();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string>("");

    async function onLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const data = {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
        }

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const response = await res.json();
            if (!res.ok) {
                throw new Error(response.message);
            }

            localStorage.setItem("token", response.token);
            router.push("/");

        } catch(error: any) {
            setError(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container mx-auto max-w-md px-4 py-16">
            <h1 className="text-3xl font-bold text-center mb-8">Sign In</h1>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            <form onSubmit={onLogin} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                </div>
                <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loading}
                >
                    {loading ? "Signing in..." : "Sign In"}
                </Button>
            </form>
        </div>
    );
}