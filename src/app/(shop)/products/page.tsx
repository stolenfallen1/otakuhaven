import { prisma } from "@/lib/prisma";
import { CategoriesSheet } from "@/components/categories-sheet";
import { ProductCard } from "@/components/product-card";

export default async function ProductPage() {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        include: { category: true }
    });

    return (
        <div className="min-h-screen dark:bg-background">
            <div className="container mx-auto px-4 py-16">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-foreground">All Products</h1>
                    <CategoriesSheet />
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
}