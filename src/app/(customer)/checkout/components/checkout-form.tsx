"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { PayPalButtons } from "@paypal/react-paypal-js";

interface CartItem {
    id: string;
    quantity: number;
    product: {
        id: string;
        name: string;
        price: number;
        image: string | null;
    };
}

interface CheckoutFormProps {
    userId: string;
    cartItems: CartItem[];
    total: number;
}

export function CheckoutForm({ userId, cartItems, total }: CheckoutFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [isPaypalOpen, setIsPaypalOpen] = React.useState<boolean>(false);
    const { toast } = useToast();
    const router = useRouter();

    const [formData, setFormData] = React.useState({
        firstName: '',
        lastName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        postalCode: '',
        phoneNumber: '',
    });

    const isFormValid = () => {
        return Boolean(
            formData.firstName &&
            formData.lastName &&
            formData.addressLine1 &&
            formData.city && 
            formData.postalCode && 
            formData.phoneNumber
        );
    }
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const createOrder = async (data: any, actions: any) => {
        const totalInUSD = total / 60; // Static conversion of PHP to Dollar for now
        
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: totalInUSD.toFixed(2)
                    }
                }
            ],
            application_context: {
                shipping_preference: "NO_SHIPPING",
            }
        });
    };

    const onApprove = async (data: any, actions: any) => {
        setIsLoading(true);
        try {
            const result = await actions.order.capture();
            console.log('Payment successful:', result);
            toast({
                variant: "success",
                title: "Payment successful",
                description: "Your order has been placed and is being processed",
                duration: 2000,
            });
            router.push("/");
        } catch (error: any) {
            console.error('Payment failed', error);
            toast({
                variant: "destructive",
                title: "Payment failed",
                description: "There is something wrong checking out, please try again later.",
                duration: 2500,
            });
        } finally {
            setIsLoading(false);
            setIsPaypalOpen(false);
        }
    };

    const onError = (error: any) => {
        console.error('PayPal error:', error);
        toast({
            variant: "destructive",
            title: "PayPal Error",
            description: "There was a problem with PayPal. Please try again later.",
            duration: 2500,
        });
        setIsPaypalOpen(false);
    };

    return (
        <main className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
                {/* Order Summary - Left Side */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Order Summary</h2>
                    <div className="space-y-2">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{item.product.name}</p>
                                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                </div>
                                <p className="font-medium">₱{(item.product.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                        <div className="border-t pt-2 mt-4">
                            <div className="flex justify-between items-center font-bold">
                                <h1 className="text-xl font-extrabold">Total:</h1>
                                <p className="underline">₱{total.toFixed(2)}</p>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                className="mt-4 border-purple-600 text-purple-600 hover:bg-purple-50 hover:text-purple-700 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-950/50 dark:hover:text-purple-300"
                            >
                                Back to Cart
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Shipping Information - Right Side */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Shipping Information</h2>
                        <section className="grid grid-cols-2 gap-4">
                            <Input 
                                name="firstName"
                                placeholder="First Name" 
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required 
                            />
                            <Input 
                                name="lastName"
                                placeholder="Last Name" 
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required 
                            />
                        </section>
                        <Input 
                            name="addressLine1"
                            placeholder="Address Line 1" 
                            value={formData.addressLine1}
                            onChange={handleInputChange}
                            required 
                        />
                        <Input 
                            name="addressLine2"
                            placeholder="Address Line 2" 
                            value={formData.addressLine2}
                            onChange={handleInputChange}
                            required 
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Input 
                                name="city"
                                placeholder="City" 
                                value={formData.city}
                                onChange={handleInputChange}
                                required 
                            />
                            <Input 
                                name="postalCode"
                                placeholder="Postal Code" 
                                value={formData.postalCode}
                                onChange={handleInputChange}
                                type="number"
                                required 
                            />
                        </div>
                        <Input 
                            name="phoneNumber"
                            placeholder="Phone Number" 
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            type="number"
                            required 
                        />
                        <h2 className="text-xl text-center font-semibold mb-4">Payment Method</h2>
                        <section className="flex flex-col items-center justify-center">
                            {!isPaypalOpen ? (
                                <Button 
                                    type="button"
                                    className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition-all"
                                    disabled={!isFormValid()}
                                    onClick={() => setIsPaypalOpen(true)}
                                >
                                    Use Paypal Payment Options
                                </Button>
                            ) : (
                                <div className="w-full">
                                    <PayPalButtons 
                                        createOrder={createOrder}
                                        onApprove={onApprove}
                                        onError={onError}
                                        disabled={isLoading}
                                        className="w-full"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="mt-4 w-full border-purple-600 text-purple-600 hover:bg-purple-50 hover:text-purple-700 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-950/50 dark:hover:text-purple-300"
                                        onClick={() => setIsPaypalOpen(false)}
                                    >
                                        Cancel Payment
                                    </Button>
                                </div>
                            )}
                        </section>
                    </div>
                </div>

            </div>
        </main>
    );
}