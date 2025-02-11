"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    role: string;
}

export function ProfileTab() {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [user, setUser] = React.useState<User | null>(null);
    const [name, setName] = React.useState<string>("");
    const [error, setError] = React.useState<string>("");
    const { toast } = useToast();

    React.useEffect(() => {
        fetchUser();
    }, []);

    async function fetchUser() {
        try {
            const res = await fetch("/api/user/profile");
            if (!res.ok) throw new Error("Failed to fetch profile");

            const data = await res.json();
            setUser(data);
            setName(data.name);

        } catch(error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load profile",
                duration: 2000,
            })
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const form = e.currentTarget as HTMLFormElement;

        const formData = new FormData(e.currentTarget);
        const newName = formData.get("name") as string;
        const currentPassword = formData.get("currentPassword");
        const newPassword = formData.get("newPassword");
        const confirmPassword = formData.get("confirmPassword");

        const hasNameChange = newName !== user?.name;
        const hasPasswordChange = currentPassword || newPassword || confirmPassword;

        if (!hasNameChange && !hasPasswordChange) {
            setLoading(false);
            return;
        }

        const data: any = {};
        if (hasNameChange) {
            data.name = newName;
        }

        if (hasPasswordChange) {
            if (!currentPassword || !newPassword || !confirmPassword) {
                setError("All password fields are required");
                setLoading(false);
                return;
            }

            if (newPassword !== confirmPassword) {
                setError("New passwords do not match");
                setLoading(false);
                return;
            }

            if (currentPassword === newPassword) {
                setError("New password must be different from current password");
                setLoading(false);
                return;
            }

            data.currentPassword = currentPassword;
            data.newPassword = newPassword;
        }

        try {
            const res = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const response = await res.json();
                throw new Error(response.message);
            }

            const updatedUser = await res.json();
            setUser(updatedUser);
            setName(updatedUser.name);
            
            if (hasPasswordChange) {
                const currentPasswordInput = form.querySelector<HTMLInputElement>('input[name="currentPassword"]');
                const newPasswordInput = form.querySelector<HTMLInputElement>('input[name="newPassword"]');
                const confirmPasswordInput = form.querySelector<HTMLInputElement>('input[name="confirmPassword"]');

                if (currentPasswordInput) currentPasswordInput.value = '';
                if (newPasswordInput) newPasswordInput.value = '';
                if (confirmPasswordInput) confirmPasswordInput.value = '';
            }

            toast({
                variant: "success",
                title: "Success",
                description: "Profile updated successfully",
                duration: 2000,
            });

        } catch(error: any) {
            setError(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-foreground">
                            Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md bg-background text-foreground border-border focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-foreground">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full px-3 py-2 border rounded-md bg-muted text-muted-foreground border-border"
                        />
                    </div>

                    <div className="border-t pt-4 mt-6">
                        <h3 className="font-bold mb-4">Change Password</h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="currentPassword" className="text-sm font-medium text-foreground">
                                    Current Password
                                </label>
                                <input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type="password"
                                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground border-border focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="newPassword" className="text-sm font-medium text-foreground">
                                    New Password
                                </label>
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground border-border focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                                    Confirm New Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground border-border focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                />
                            </div>
                        </div>
                    </div>

                    <Button 
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}