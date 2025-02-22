'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { localCart } from '@/utils/local_cart';
import { getProductDetails } from '@/lib/actions/cart';
import { Plus, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateCartItemQuantity, removeCartItem } from '@/lib/actions/cart';
import { DeleteButtonDialog } from '@/components/delete-btn-dialog';
import { emitCartUpdate } from '@/lib/events/update-cart-counter';

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

interface CartItemsProps {
    initialItems: CartItem[];  
    userId: string | null;
}

export function CartItems({ initialItems, userId }: CartItemsProps) {
    const [items, setItems] = useState<CartItem[]>(initialItems || []);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { toast } = useToast();

    useEffect(() => {
        const fetchLocalCartItems = async () => {
            if (!userId) {
                const localItems = localCart.getItems();
                if (localItems.length === 0) {
                    setItems([]);
                    return;
                }

                try {
                    const products = await getProductDetails(
                        localItems.map(item => item.productId)
                    );

                    const cartItems: CartItem[] = localItems.map(localItem => {
                        const product = products.find(p => p.id === localItem.productId);
                        if (!product) return null;

                        return {
                            id: localItem.productId,
                            quantity: localItem.quantity,
                            product: {
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                image: product.image
                            }
                        };
                    }).filter((item): item is CartItem => item !== null);

                    setItems(cartItems);
                } catch (error) {
                    console.error('Error fetching product details:', error);
                    setItems([]);
                }
            }
        };

        fetchLocalCartItems();
    }, [userId]);

    const updateQuantity = async (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        setIsLoading(true);

        try {
            if (userId) {
                await updateCartItemQuantity(itemId, newQuantity);
            } else {
                localCart.updateQuantity(itemId, newQuantity);
            }

            setItems(prevItems => 
                prevItems.map(item => 
                    item.id === itemId 
                        ? { ...item, quantity: newQuantity }
                        : item
                )
            );
            emitCartUpdate();
            toast({
                variant: 'success',
                title: 'Updated Cart Quantity',
                description: 'The quantity was updated successfully.',
                duration: 1500,
            });

        } catch(error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Something went wrong while updating the quantity.',
                duration: 2000,
            });
        } finally {
            setIsLoading(false);
        }
    }

    const removeItem = async (itemId: string) => {
        setIsLoading(true);

        try {
            if (userId) {
                await removeCartItem(itemId);
            } else {
                localCart.removeItem(itemId);
            }

            setItems(prevItems => prevItems.filter(item => item.id !== itemId));
            emitCartUpdate();
            toast({
                variant: 'warning',
                title: 'Removed',
                description: 'The item was removed from your cart.',
                duration: 1500,
            });

        } catch(error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Something went wrong while removing the item.',
                duration: 2000,
            });
        } finally {
            setIsLoading(false);
        }
    }

    if (!items || items.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
                    <Link href="/">
                        <Button variant="outline">Continue Shopping</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto min-h-0"> 
                <div className="space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                            <div className="w-24 h-24 relative bg-muted rounded-md overflow-hidden">
                                {item.product.image ? (
                                    <img
                                        src={item.product.image}
                                        alt={item.product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50" />
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold">{item.product.name}</h3>
                                <p className="text-sm text-muted-foreground">₱{item.product.price.toFixed(2)}</p>
                            </div>
                            <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        disabled={isLoading}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <div className="w-full text-center">
                                        <span className="font-bold">Quantity: </span>{item.quantity}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        disabled={isLoading}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="w-full text-right">
                                    <span className="font-bold">Price: </span> ₱{(item.product.price * item.quantity).toFixed(2)}
                                </div>
                                <DeleteButtonDialog 
                                    title="Remove Cart Item"
                                    description="Are you sure you want to remove this item from your cart?"
                                    action={() => removeItem(item.id)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-auto border-t bg-background">
                <div className="py-4">
                    <div className="flex justify-end space-x-4 items-center mb-4">
                        <p className="text-2xl font-bold">Total:</p>
                        <p className="text-2xl font-bold">₱{total.toFixed(2)}</p>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Link href="/">
                            <Button 
                                variant="outline"
                                className="w-full border-purple-600 text-purple-600 hover:bg-purple-50 hover:text-purple-700 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-950/50 dark:hover:text-purple-300"
                            >
                                Continue Shopping
                            </Button>
                        </Link>
                        <Link href="/checkout">
                            <Button
                                className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition-all"
                            >
                                Proceed to Checkout
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}