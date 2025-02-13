"use client";

// Error message toast for server components ( Use in deletion of items such as categories, products, etc.)

import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function ServerError({ error }: { error: Error }) {
    const { toast } = useToast();

    useEffect(() => {
        toast({
            variant: "destructive",
            title: "Error",
            description: error.message,
            duration: 2000,
        });
    }, [error, toast]);

    return null;
}