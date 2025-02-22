import { cookies } from "next/headers";
import { verifyJWT } from "@/utils/jwt";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CheckoutForm } from "./components/checkout-form";

async function getCartItems(userId: string) {
    const cart = await prisma.cart.findFirst({
        where: { userId },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        }
    });
    return cart?.items || [];
}

export default async function CheckoutPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    let userId: string | null = null;
    let returnTo = encodeURIComponent('/checkout');

    if (!token) {
        redirect(`/sign-in?returnTo=${returnTo}`);
    }

    try {
        const payload = await verifyJWT(token);
        if (payload && 'id' in payload) {
            userId = payload.id as string;
        }
    } catch (error) {
        console.error('Error verifying JWT:', error);
        redirect(`/sign-in?returnTo=${returnTo}`);
    }

    const cartItems = await getCartItems(userId as string);

    if (!cartItems.length) {
        redirect('/cart');
    }

    const total = cartItems.reduce((sum, item) => {
        return sum + (item.product.price * item.quantity);
    }, 0);

    return (
        <div className="min-h-screen flex flex-col p-4 md:p-8">
            <h1 className="text-3xl mb-8 text-center font-bold text-purple-600 dark:text-purple-400">Checkout</h1>
            <div className="flex-1">
                <CheckoutForm 
                    userId={userId as string}
                    cartItems={cartItems}
                    total={total}
                />
            </div>
        </div>
    );
}