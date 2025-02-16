'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { verifyJWT } from "@/utils/jwt";

export async function addToCart(formData: FormData) {
    const productId = formData.get('productId') as string;
    const quantity = Number(formData.get('quantity') || 1);

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return { suceess: true, guest: true };
        }

        const payload = await verifyJWT(token);
        if (!payload || !('id' in payload)) {
            throw new Error('Invalid token');
        }

        const userId = payload.id as string;
        let cart = await prisma.cart.findFirst({
            where: { userId },
        });
        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId },
            });
        }

        const existingCartItem = await prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId,
                }
            }
        });

        if (existingCartItem) {
            await prisma.cartItem.update({
                where: { id: existingCartItem.id },
                data: { quantity: existingCartItem.quantity + quantity  },
            });
        } else {
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    quantity,
                },
            });
        }

        revalidatePath('/');
        return { success: true, guest: false };

    } catch (error) {
        throw new Error('Failed to add item to cart');
    }
}

export async function getProductDetails(productIds: string[]) {
    try {
        const products = await prisma.product.findMany({
            where: {
                id: {
                    in: productIds
                }
            }
        });
        return products;
    } catch (error) {
        throw new Error('Failed to fetch product details');
    }
}

export async function getCartItemsCount(userId: string) {
    try {
        const cartItems = await prisma.cartItem.findMany({
            where: {
                cart: {
                    userId: userId
                }
            }
        });

        return cartItems.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
        console.error('Error fetching cart count:', error);
        return 0;
    }
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
    try {
        await prisma.cartItem.update({
            where: { id: cartItemId },
            data: { quantity },
        });
        revalidatePath('/cart');
        return { success: true };
    } catch (error) {
        throw new Error('Failed to update cart item quantity');
    }
}

export async function removeCartItem(cartItemId: string) {
    try {
        await prisma.cartItem.delete({
            where: { id: cartItemId },
        });
        revalidatePath('/cart');
        return { success: true };
    } catch (error) {
        throw new Error('Failed to remove cart item');
    }
}