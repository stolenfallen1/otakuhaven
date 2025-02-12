import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { CategoryDialog } from "./components/category-dialog";

export default async function CategoriesPage() {
    const categories = await prisma.category.findMany({
        orderBy: { createdAt: 'desc' }
    });

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
                            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Created At</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
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
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{category.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {new Date(category.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                        <Button variant="outline" size="sm">Edit</Button>
                                        <Button variant="destructive" size="sm">Delete</Button>
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