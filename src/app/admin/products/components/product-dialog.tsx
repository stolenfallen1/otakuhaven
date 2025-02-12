"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export function ProductDialog() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600">
                    Add New Product
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <form className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label htmlFor="name">Name</label>
                        <Input id="name" name="name" />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="description">Description</label>
                        <Textarea id="description" name="description" />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="price">Price</label>
                        <Input id="price" name="price" type="number" step="0.01" />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="stock">Stock</label>
                        <Input id="stock" name="stock" type="number" />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="image">Image URL</label>
                        <Input id="image" name="image" />
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600">
                            Create Product
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}