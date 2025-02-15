'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { localCart } from '@/utils/local_cart';
import { addToCart } from '@/lib/actions/cart';
import { useToast } from '@/hooks/use-toast';

interface AddToCartButtonProps {
    productId: string;
    quantity?: number;
}

export function AddToCartButton({ productId, quantity = 1 }: AddToCartButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleAddToCart = async () => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('productId', productId);
            formData.append('quantity', quantity.toString());

            const result = await addToCart(formData);

            if (result.guest) {
                localCart.addItem(productId, quantity);
            }

            toast({
                variant: "success",
                title: "Added to cart",
                description: "Item has been added to your cart",
                duration: 1500,
            });

        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to add item to cart",
                duration: 1500,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button 
            onClick={handleAddToCart}
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition-all"
        >
            {isLoading ? "Adding..." : "Add to Cart"}
        </Button>
    );
}