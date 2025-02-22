import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OrderDetails } from "../components/order-details";
import { cookies } from "next/headers";
import { verifyJWT } from "@/utils/jwt";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface OrderPageProps {
    params: {
        orderId: string;
    }
}

export default async function OrderPage({ params }: OrderPageProps) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    let userId: string | null = null;

    if (!token) {
        redirect('/sign-in');
    }

    try {
        const payload = await verifyJWT(token);
        if (payload && 'id' in payload) {
            userId = payload.id as string;
        }
    } catch (error) {
        console.error('Error verifying JWT:', error);
        redirect('/sign-in');
    }

    const order = await prisma.order.findUnique({
        where: {
            id: params.orderId,
            userId: userId as string,
        },
        include: {
            items: {
                include: {
                    product: true,
                }
            }
        }
    });

    if (!order) {
        redirect('/orders');
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/orders">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Order Details</h1>
            </div>
            <OrderDetails order={order} />
        </div>
    );
}