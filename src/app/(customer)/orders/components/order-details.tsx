"use client";

import { Order, OrderItem, Product } from "@prisma/client";
import { cn } from "@/lib/utils";

interface OrderDetailsProps {
    order: Order & {
        items: (OrderItem & {
            product: Product
        })[];
    }
}

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

export function OrderDetails({ order }: OrderDetailsProps) {
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(order.createdAt));

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-xl font-bold">Reference Number</h1>
                    <p className="text-muted-foreground">{order.id}</p>
                </div>
                <div className="text-right flex flex-col">
                    <section className="flex-row items-center">
                        <span className="text-muted-foreground">Order Status: </span>
                        <span className={cn(
                            "font-semibold px-2 py-1 text-sm rounded-full",
                            orderStatusStyles[order.status as keyof typeof orderStatusStyles] || "text-gray-800 dark:text-gray-200"
                        )}>
                            {order.status}
                        </span>
                    </section>
                    <p className="text-sm text-muted-foreground">{formattedDate}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <h2 className="text-xl font-bold">Shipping Information</h2>
                    <div className="space-y-2">
                        <p>{order.firstName} {order.lastName}</p>
                        <p>{order.addressLine1}</p>
                        {order.addressLine2 && <p>{order.addressLine2}</p>}
                        <p>{order.city}, {order.postalCode}</p>
                        <p>{order.phoneNumber}</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <h2 className="text-xl font-bold">Payment Information</h2>
                    <div className="space-y-2">
                        <section className="flex items-center gap-2">
                            <span className="text-muted-foreground">PayPal Transaction ID: </span>
                            <p>{order.paypalOrderId}</p>
                        </section>
                        <section className="flex items-center gap-2">
                            <span className="text-muted-foreground">Payment Status: </span>
                            <span className={cn(
                                "font-semibold px-2 py-1 text-sm rounded-full",
                                paymentStatusStyles[order.paymentStatus as keyof typeof paymentStatusStyles] || "text-gray-800 dark:text-gray-200"
                            )}>
                                {order.paymentStatus}
                            </span>
                        </section>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <h2 className="text-xl font-bold">Order Items</h2>
                <div className="divide-y">
                    {order.items.map((item) => (
                        <div key={item.id} className="py-2 flex justify-between items-center">
                            <div>
                                <p className="font-medium">{item.product.name}</p>
                                <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                            </div>
                            <p className="font-medium">₱{item.price.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
                <div className="border-t pt-3">
                    <div className="flex justify-between items-center font-bold">
                        <p className="text-xl">Total:</p>
                        <p>₱{order.total.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}