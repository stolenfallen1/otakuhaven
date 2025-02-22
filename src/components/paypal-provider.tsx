"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { PropsWithChildren } from "react";

export function PayPalProvider({ children }: PropsWithChildren) {
    return (
        <PayPalScriptProvider
            options={{
                "clientId": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                currency: "USD",
            }}
        >
            {children}
        </PayPalScriptProvider>
    )
}