"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OrdersTab() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-muted-foreground text-center py-8">
                    No orders found
                </div>
            </CardContent>
        </Card>
    );
}