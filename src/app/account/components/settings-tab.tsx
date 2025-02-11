"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SettingsTab() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium mb-4">Email Preferences</h3>
                    <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" className="rounded border-gray-300" />
                            <span>Receive order updates</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" className="rounded border-gray-300" />
                            <span>Receive promotional emails</span>
                        </label>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium mb-4">Danger Zone</h3>
                    <Button variant="destructive">
                        Delete Account
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}