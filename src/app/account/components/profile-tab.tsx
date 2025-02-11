"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProfileTab() {
    const [loading, setLoading] = useState(false);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-foreground">
                        Name
                    </label>
                    <input
                        id="name"
                        type="text"
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
                        disabled
                        className="w-full px-3 py-2 border rounded-md bg-muted text-muted-foreground border-border"
                    />
                </div>
                <div className="pt-4">
                    <Button 
                        className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}