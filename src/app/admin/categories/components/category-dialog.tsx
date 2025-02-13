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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface Category {
    id: string;
    name: string;
    description: string;
}

interface CategoryDialogProps {
    category?: Category;
}

export function CategoryDialog({ category }: CategoryDialogProps) {
    const [open, setOpen] = React.useState(false);
    const [formData, setFormData] = React.useState({
        name: category?.name?? "",
        description: category?.description?? "",
    });
    const [loading, setLoading] = React.useState(false);
    const { toast } = useToast();
    const router = useRouter();

    React.useEffect(() => {
        if (open) {
            setFormData({
                name: category?.name?? "",
                description: category?.description?? "",
            });
        } 
    }, [open, category]);

    const isEditing = !!category;

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isEditing 
                ? `/api/admin/categories/${category.id}`
                : "/api/admin/categories";

            const res = await fetch(url, {
                method: isEditing ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || `Failed to ${isEditing ? 'update' : 'create'} category`);
            }

            toast({
                variant: "success",
                title: "Success",
                description: `Category ${isEditing ? 'updated' : 'created'} successfully`,
                duration: 1500,
            });
            setOpen(false);
            router.refresh();
            
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : `Failed to ${isEditing ? 'update' : 'create'} category`,
                duration: 2000,
            });
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value}));
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {isEditing ? (
                    <Button variant="outline" size="sm">
                        Edit
                    </Button>
                ) : (
                    <Button className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600">
                        Add New Category
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label htmlFor="name">Name</label>
                        <Input 
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="description">Description</label>
                        <Textarea 
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            required
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
                            {loading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Category" : "Create Category")}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}