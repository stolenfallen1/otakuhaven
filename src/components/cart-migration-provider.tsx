'use client';

import { useEffect } from 'react';
import { localCart } from '@/utils/local_cart';
import { migrateCart } from '@/lib/actions/migrate-cart';

interface CartMigrationProviderProps {
    children: React.ReactNode;
    userId: string | null;
}

export function CartMigrationProvider({ children, userId }: CartMigrationProviderProps) {
    useEffect(() => {
        const migrateLocalCart = async () => {
            if (!userId) return;

            const localItems = localCart.getItems();
            if (localItems.length === 0) return;

            try {
                await migrateCart(userId, localItems);
                localCart.clearCart();

                console.log('Cart migration successful');
            } catch (error) {
                console.error('Error migrating cart:', error);
            }
        };
        
        migrateLocalCart();
    }, [userId]);

    return <>{children}</>;
}