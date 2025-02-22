import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJWT } from "@/utils/jwt";
import Link from "next/link";
import { cn } from "@/lib/utils";

const paymentStatusStyles = {
    COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    FAILED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
}

const orderStatusStyles = {
    PROCESSING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    SHIPPED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
}

export default async function OrdersPage() {
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

    const orders = await prisma.order.findMany({
        where: {
            userId: userId as string,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
            <h1 className="text-2xl font-bold mb-6">My Orders</h1>
            <div className="space-y-4">
                {orders.map((order) => (
                    <Link 
                        key={order.id} 
                        href={`/orders/${order.id}`}
                        className="block p-4 sm:p-6 rounded-lg border hover:border-purple-500 transition-colors"
                    >
                        <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-start sm:space-y-0">
                            <div className="space-y-1 text-center sm:text-left">
                                <p className="text-sm text-muted-foreground">Reference Num: {order.id}</p>
                                <p className="text-lg font-bold">{order.firstName} {order.lastName}</p>
                                <p className="text-sm text-muted-foreground">
                                    {new Intl.DateTimeFormat('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    }).format(new Date(order.createdAt))}
                                </p>
                                <p className="text-lg font-bold">₱{order.total.toFixed(2)}</p>
                            </div>
                            <div className="flex flex-col space-y-3 items-center sm:items-end">
                                <section className="flex flex-col sm:flex-row items-center gap-1">
                                    <span className="text-sm text-muted-foreground">Payment Status:</span>
                                    <span className={cn(
                                        "inline-block px-2 py-1 text-xs rounded-full",
                                        paymentStatusStyles[order.paymentStatus as keyof typeof paymentStatusStyles] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                                    )}>
                                        {order.paymentStatus}
                                    </span>
                                </section>
                                <section className="flex flex-col sm:flex-row items-center gap-1">
                                    <span className="text-sm text-muted-foreground">Order Status:</span>
                                    <span className={cn(
                                        "inline-block px-2 py-1 text-xs rounded-full",
                                        orderStatusStyles[order.status as keyof typeof orderStatusStyles]
                                    )}>
                                        {order.status}
                                    </span>
                                </section>
                            </div>
                        </div>
                    </Link>
                ))}
                {orders.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No orders found</p>
                    </div>
                )}
            </div>
        </div>
    );
}