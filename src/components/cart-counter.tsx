'use client';

import Link from "next/link";
import { useEffect, useState } from 'react';
import { localCart } from '@/utils/local_cart';
import { ShoppingCart } from "lucide-react";
import { getCartItemsCount } from '@/lib/actions/cart';
import { CART_UPDATED } from "@/lib/events/update-cart-counter";

interface CartCounterProps {
    userId: string | null;
}

export function CartCounter({ userId }: CartCounterProps) {
    const [itemCount, setItemCount] = useState<number>(0);

    useEffect(() => {
        const updateCount = async () => {
            if (userId) {
                const count = await getCartItemsCount(userId);
                setItemCount(count);
            } else {
                const localItems = localCart.getItems();
                const count = localItems.reduce((total, item) => total + item.quantity, 0);
                setItemCount(count);
            }
        };

        updateCount();

        // Listen for both storage and custom cart update events
        window.addEventListener(CART_UPDATED, updateCount);
        if (!userId) {
            window.addEventListener('storage', updateCount);
        }

        return () => {
            window.removeEventListener(CART_UPDATED, updateCount);
            if (!userId) {
                window.removeEventListener('storage', updateCount);
            }
        };
    }, [userId]);

    return (
        <Link href="/cart" className="relative text-foreground/60 hover:text-purple-600 dark:hover:text-purple-400">
            <ShoppingCart width="20" height="20" />
            {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {itemCount}
                </span>
            )}
        </Link>
    );
}