import { prisma } from "@/lib/prisma";
import { ProductDialog } from "./components/product-dialog";
import { DeleteButtonDialog } from "@/components/delete-btn-dialog";
import { revalidatePath } from "next/cache";
import { ServerError } from "@/components/server-error";

export default async function ProductsPage() {
    const [products, categories] = await Promise.all([
        prisma.product.findMany({
            include: {
                category: true
            }
        }),
        prisma.category.findMany()
    ]);

    async function deleteProduct(productId: string) {
        'use server';

        try {
            const stillHasStocks = await prisma.product.count({
                where: {
                    id: productId,
                    stock: { gt: 0 }
                }
            });

            if (stillHasStocks > 0) {
                throw new Error('Product still has stocks. Cannot delete.');
            }

            await prisma.product.delete({
                where: { id: productId }
            });
            revalidatePath('/admin/products');
        } catch (error) {
            console.error('Failed to delete product:', error);
            throw error;
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Products Management</h1>
                <ProductDialog categories={categories} />
            </div>
            
            <div className="rounded-md border">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Category</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Price</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Stock</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-sm text-muted-foreground">
                                    No products found
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{product.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{product.category.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">₱ {product.price}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{product.stock} pcs.</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                        <ProductDialog categories={categories} product={product} />
                                        <DeleteButtonDialog 
                                            title="Delete Product"
                                            description={`Are you sure you want to delete "${product.name}"?`}
                                            action={deleteProduct.bind(null, product.id)}
                                            errorComponent={ServerError}
                                        />
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