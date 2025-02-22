export interface PayPalOrderResponse {
    id: string;
    status: string;
    payer: {
        email_address: string;
        payer_id: string;
    };
    create_time: string;
    update_time: string;
}

export interface CreateOrderRequest {
    userId: string;
    cartItems: {
        id: string;
        quantity: number;
        product: {
            id: string;
            price: number;
        };
    }[];
    total: number;
    shippingDetails: {
        firstName: string;
        lastName: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        postalCode: string;
        phoneNumber: string;
    };
    paypalOrder: PayPalOrderResponse;
}