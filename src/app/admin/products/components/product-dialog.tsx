"use client";

import React from "react";
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
import { 
    Select, 
    SelectTrigger, 
    SelectValue,
    SelectItem, 
    SelectContent 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string | null;
    categoryId: string;
}

interface ProductDialogProps {
    categories: any[];
    product?: Product;
}

export function ProductDialog({ categories, product }: ProductDialogProps) {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [formData, setFormData] = React.useState({
        name: product?.name ?? "",
        description: product?.description ?? "",
        price: product?.price ?? "",
        stock: product?.stock ?? "",
        image: product?.image ?? "",
        categoryId: product?.categoryId ?? "",
    });
    const { toast } = useToast();
    const router = useRouter();

    React.useEffect(() => {
        if (open) {
            setFormData({
                name: product?.name ?? "",
                description: product?.description ?? "",
                price: product?.price ?? "",
                stock: product?.stock ?? "",
                image: product?.image ?? "",
                categoryId: product?.categoryId ?? "",
            });
        }
    }, [open, product]);

    const isEditing = !!product;

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        try {
            const url = isEditing 
                ? `/api/admin/products/${product.id}`
                : "/api/admin/products";

            const response = await fetch(url, {
                method: isEditing ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || `Failed to ${isEditing ? 'update' : 'create'} product`);
            }

            toast({
                variant: "success",
                title: "Success",
                description: `Product ${isEditing ? 'updated' : 'created'} successfully.`,
                duration: 1500,
            });
            setOpen(false);
            router.refresh();
            
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : `Failed to ${isEditing ? 'update' : 'create'} product`,
                duration: 2000,
            });
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {isEditing ? (
                    <Button variant="outline" size="sm">
                        Edit
                    </Button>
                ) : (
                    <Button className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600">
                        Add New Product
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-h-[93vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
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
                        />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="price">Price</label>
                        <Input 
                            id="price" 
                            type="number" 
                            step="0.01" 
                            value={formData.price}
                            onChange={(e) => handleChange('price', e.target.value)}
                            required 
                        />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="stock">Stock</label>
                        <Input 
                            id="stock" 
                            type="number" 
                            min="1" 
                            value={formData.stock}
                            onChange={(e) => handleChange('stock', e.target.value)}
                            required 
                        />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="categoryId">Category</label>
                        <Select 
                            value={formData.categoryId} 
                            onValueChange={(value) => handleChange('categoryId', value)}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="image">Image URL</label>
                        <Input 
                            id="image" 
                            value={formData.image}
                            onChange={(e) => handleChange('image', e.target.value)}
                        />
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
                            disabled={loading}
                        >
                            {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Product' : 'Create Product')}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}