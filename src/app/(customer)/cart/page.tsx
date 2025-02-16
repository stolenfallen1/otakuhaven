import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJWT } from "@/utils/jwt";
import { CartItems } from "./components/cart-items";

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

export default async function CartPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    let userId: string | null = null;

    if (token) {
        try {
            const payload = await verifyJWT(token);
            if (payload && 'id' in payload) {
                userId = payload.id as string;
            }
        } catch (error) {
            console.error('Error verifying JWT:', error);
        }
    }

    const cartItems = userId ? await getCartItems(userId) : [];

    return (
        <div className="h-screen flex flex-col p-4">
            <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
            <div className="flex-1 min-h-0"> 
                <CartItems initialItems={cartItems} userId={userId} />
            </div>
        </div>
    );
}