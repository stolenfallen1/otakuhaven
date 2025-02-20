import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { CategoriesSheet } from "@/components/categories-sheet";

export default async function ProductPage() {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        include: { category: true }
    });

    const getColor = (name: string) => {
        switch (name) {
            case 'Collectibles':
                return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
            case 'Manga':
                return 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400';
            case 'Streetwear':
                return 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400';
            case 'Merchandise':
                return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400';
            default:
                return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400';
        }
    };

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
                        <div key={product.id} className="group border dark:border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow bg-card">
                            <div className="aspect-square bg-muted rounded-lg mb-4 overflow-hidden">
                                <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between gap-1">
                                    <h2 className="text-xl font-semibold line-clamp-1 text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                        {product.name}
                                    </h2>
                                    <span className={`text-xs px-2 py-1 rounded-full ${getColor(product.category.name)}`}>
                                        {product.category.name}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">₱{product.price.toFixed(2)}</p>
                                    <p className="text-sm text-purple-500/90 dark:text-purple-300/80 font-extralight">{product.stock} pcs. left</p>
                                </div>
                                <section className="flex space-x-2 lg:space-x-4">
                                    <Link 
                                        href={`/product/${product.id}`}
                                        className="w-full"
                                    >
                                        <Button 
                                        variant="outline"
                                        className="w-full border-purple-600 text-purple-600 hover:bg-purple-50 hover:text-purple-700 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-950/50 dark:hover:text-purple-300"
                                        >
                                        View Details
                                        </Button>
                                    </Link>
                                    <AddToCartButton productId={product.id} />
                                </section>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}