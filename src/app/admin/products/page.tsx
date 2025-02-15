import { prisma } from "@/lib/prisma";
import { ProductDialog } from "./components/product-dialog";
import { revalidatePath } from "next/cache";
import { FeatureButton } from "./components/feature-button";
import { ProductsTable } from "./components/products-table";

export default async function ProductsPage() {
    const [products, categories] = await Promise.all([
        prisma.product.findMany({
            include: {
                category: true
            }
        }),
        prisma.category.findMany()
    ]);

    async function toggleFeatureProduct(formData: FormData) {
        'use server';
        
        const productId = formData.get('productId') as string;
        const featured = formData.get('featured') === '1';  
        
        try {
            if (featured) {  
                await prisma.product.update({
                    where: { id: productId },
                    data: { featured: false }
                });
            } else { 
                await prisma.product.update({
                    where: { id: productId },
                    data: { featured: true }
                });
            }
            
            revalidatePath('/admin/products');
        } catch (error) {
            throw error;
        }
    }

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
            
            <ProductsTable 
                data={products}
                categories={categories}
                deleteProduct={deleteProduct}
                toggleFeature={toggleFeatureProduct}
            />
        </div>
    );
}