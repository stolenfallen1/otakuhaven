import { prisma } from "@/lib/prisma";
import { CategoryDialog } from "./components/category-dialog";
import { DeleteButtonDialog } from "@/components/delete-btn-dialog";
import { revalidatePath } from "next/cache";
import { ServerError } from "@/components/server-error";

export default async function CategoriesPage() {
    const categories = await prisma.category.findMany({
        orderBy: { createdAt: 'desc' }
    });

    async function deleteCategory(categoryId: string) {
        'use server';
        
        try {
            const hasProduct = await prisma.product.count({
                where: { categoryId }
            });

            if (hasProduct > 0) {
                throw new Error('Cannot delete category with associated products.');
            }

            await prisma.category.delete({
                where: { id: categoryId }
            });
            revalidatePath('/admin/categories');
        } catch (error) {
            console.error('Failed to delete category:', error);
            throw error;
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Categories Management</h1>
                <CategoryDialog />
            </div>

            <div className="rounded-md border">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Description</th>
                            <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-4 text-center text-sm text-muted-foreground">
                                    No categories found
                                </td>
                            </tr>
                        ) : (
                            categories.map((category) => (
                                <tr key={category.id}>
                                    <td className="px-6 py-4 text-sm">{category.name}</td>
                                    <td className="px-6 py-4 text-sm">{category.description}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <CategoryDialog category={category} />
                                            <DeleteButtonDialog
                                                title="Delete Category" 
                                                description={`Are you sure you want to delete "${category.name}"?`}
                                                action={deleteCategory.bind(null, category.id)}
                                                errorComponent={ServerError}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}