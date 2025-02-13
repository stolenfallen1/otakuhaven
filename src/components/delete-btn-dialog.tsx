"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteButtonDialogProps {
    title: string;
    description: string;
    action: () => Promise<void>;
    errorComponent?: React.ComponentType<{ error: Error }>;
}

export function DeleteButtonDialog({ 
    title, 
    description, 
    action,
    errorComponent: ErrorComponent 
}: DeleteButtonDialogProps) {
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(false);
    
    async function handleAction() {
        setLoading(true);
        try {
            await action();
            setError(null);
        } catch (e) {
            if (e instanceof Error) {
                setError(e);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                    <form action={handleAction}>
                        <Button 
                            variant="destructive" 
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Deleting..." : "Delete"}
                        </Button>
                    </form>
                </AlertDialogFooter>
            </AlertDialogContent>
            {error && ErrorComponent && <ErrorComponent error={error} />}
        </AlertDialog>
    );
}