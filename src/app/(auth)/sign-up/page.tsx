"use client";

import React from "react";
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
            const res = await fetch("/api/register", {
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
            <h1 className="text-3xl font-bold text-center mb-8">Sign Up</h1>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            <form onSubmit={onRegister} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                        Full Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                </div>
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
                <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
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
                    {loading ? "Signing up..." : "Sign Up"}
                </Button>
            </form>
        </div>
    );
}