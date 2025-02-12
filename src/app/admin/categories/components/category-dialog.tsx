"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function CategoryDialog() {
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const { toast } = useToast();
    const router = useRouter();

    async function onCreateCategory(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/admin/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to create category");
            }

            toast({
                variant: "success",
                title: "Success",
                description: "Category created successfully",
                duration: 1500,
            });
            
            setName("");
            setOpen(false);
            router.refresh();
            
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to create category",
                duration: 2000,
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600">
                    Add New Category
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                </DialogHeader>
                <form onSubmit={onCreateCategory} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label htmlFor="name">Category Name</label>
                        <Input 
                            id="name"
                            value={name}
                            required
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter category name"
                        />
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Create Category"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}