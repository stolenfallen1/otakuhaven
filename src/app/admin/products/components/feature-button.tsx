"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { ServerError } from "@/components/server-error";

interface FeatureButtonProps {
    productId: string;
    featured: boolean;
    onToggle: (formData: FormData) => Promise<void>;
}

export function FeatureButton({ productId, featured, onToggle }: FeatureButtonProps) {
    const [error, setError] = useState<Error | null>(null);

    async function handleAction(formData: FormData) {
        try {
            await onToggle(formData);
            setError(null);
        } catch (e) {
            if (e instanceof Error) {
                setError(e);
            }
        }
    }

    return (
        <>
            <form>
                <input type="hidden" name="productId" value={productId} />
                <input type="hidden" name="featured" value={featured ? "1" : "0"} />
                <button
                    formAction={handleAction}
                    className={`${featured ? 'text-yellow-400' : 'text-gray-400'} hover:text-yellow-400 transition-colors`}
                >
                    <Star />
                </button>
            </form>
            {error && <ServerError error={error} />}
        </>
    );
}