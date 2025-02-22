import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreateOrderRequest } from "@/types/order";

export async function POST(request: Request) {
    try {
        const body: CreateOrderRequest = await request.json();
        const { userId, cartItems, total, shippingDetails, paypalOrder } = body;

        const order = await prisma.order.create({
            data: {
                userId,
                total,
                paypalOrderId: paypalOrder.id,
                paypalPayerId: paypalOrder.payer.payer_id,
                paypalEmail: paypalOrder.payer.email_address,
                paymentStatus: paypalOrder.status,
                paymentTime: new Date(paypalOrder.update_time),
                firstName: shippingDetails.firstName,
                lastName: shippingDetails.lastName,
                addressLine1: shippingDetails.addressLine1,
                addressLine2: shippingDetails.addressLine2,
                city: shippingDetails.city,
                postalCode: shippingDetails.postalCode,
                phoneNumber: shippingDetails.phoneNumber,
                items: {
                    create: cartItems.map(item => ({
                        productId: item.product.id,
                        quantity: item.quantity,
                        price: item.product.price
                    }))
                }
            },
            include: {
                items: true
            }
        });

        if (order && order.id) {
            const cart = await prisma.cart.findFirst({
                where: { userId: userId }
            });
            if (cart) {
                await prisma.cart.delete({
                    where: { id: cart.id }
                });
            }
        }

        return NextResponse.json(order);
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}