'use server';

import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";

export async function migrateCart(userId: string, localCartItems: { productId: string; quantity: number}[]) {
    try {
        let cart = await prisma.cart.findFirst({
            where: { userId },
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId },
            });
        }

        for (const item of localCartItems) {
            const existingItem = await prisma.cartItem.findUnique({
                where: {
                    cartId_productId: {
                        cartId: cart.id,
                        productId: item.productId,
                    }
                }
            });

            if (existingItem) {
                await prisma.cartItem.update({
                    where: { id: existingItem.id },
                    data: { quantity: existingItem.quantity + item.quantity  },
                });
            } else {
                await prisma.cartItem.create({
                    data: {
                        cartId: cart.id,
                        productId: item.productId,
                        quantity: item.quantity,
                    }
                });
            }
        }

        revalidatePath('/');
        return { success: true };

    } catch (error) {
        console.error('Cart migration error:', error);
        throw new Error('Failed to migrate cart items');
    }
}