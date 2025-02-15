'use client';

import Link from "next/link";
import { useEffect, useState } from 'react';
import { localCart } from '@/utils/local_cart';
import { ShoppingCart } from "lucide-react";
import { getCartItemsCount } from '@/lib/actions/cart';
import { useRouter } from "next/navigation";

interface CartCounterProps {
    userId: string | null;
}

export function CartCounter({ userId }: CartCounterProps) {
    const [itemCount, setItemCount] = useState<number>(0);
    const router = useRouter();

    useEffect(() => {
        const updateCount = async () => {
            if (userId) {
                const count = await getCartItemsCount(userId);
                setItemCount(count);
                router.refresh(); 
            } else {
                const localItems = localCart.getItems();
                const count = localItems.reduce((total, item) => total + item.quantity, 0);
                setItemCount(count);
            }
        };

        updateCount();

        // Set up an interval to periodically check for updates
        const interval = setInterval(updateCount, 2000);

        if (!userId) {
            window.addEventListener('storage', updateCount);
        }

        return () => {
            clearInterval(interval);
            if (!userId) {
                window.removeEventListener('storage', updateCount);
            }
        };
    }, [userId, router]);

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