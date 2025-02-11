"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

export function AddressTab() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Shipping Addresses</CardTitle>
                <Button className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Address
                </Button>
            </CardHeader>
            <CardContent>
                <div className="text-muted-foreground text-center py-8">
                    No addresses added yet
                </div>
            </CardContent>
        </Card>
    );
}