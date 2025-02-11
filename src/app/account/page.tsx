"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileTab } from "./components/profile-tab";
import { AddressTab } from "./components/address-tab";
import { OrdersTab } from "./components/orders-tab";
import { SettingsTab } from "./components/settings-tab";

export default function AccountPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">My Account</h1>
            
            <Tabs defaultValue="profile" className="space-y-4">
                <TabsList className="flex flex-col sm:flex-row w-full sm:w-auto h-auto">
                    <TabsTrigger value="profile" className="w-full sm:w-auto">Profile</TabsTrigger>
                    <TabsTrigger value="addresses" className="w-full sm:w-auto">Addresses</TabsTrigger>
                    <TabsTrigger value="orders" className="w-full sm:w-auto">Orders</TabsTrigger>
                    <TabsTrigger value="settings" className="w-full sm:w-auto">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-6">
                    <ProfileTab />
                </TabsContent>

                <TabsContent value="addresses" className="mt-6">
                    <AddressTab />
                </TabsContent>

                <TabsContent value="orders" className="mt-6">
                    <OrdersTab />
                </TabsContent>

                <TabsContent value="settings" className="mt-6">
                    <SettingsTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}