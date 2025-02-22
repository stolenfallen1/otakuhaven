import { ProductCard } from "@/components/product-card";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function CategoryPage({ params }: { params: { slug: string }; }) {
    const category = await prisma.category.findFirst({
        where: {
            name: {
                equals: params.slug.charAt(0).toUpperCase() + params.slug.slice(1),
            }
        },
        include: {
            products: {
                include: {
                    category: true,
                }
            }
        }
    });

    if (!category) {
        notFound();
    }

    return (
        <div className="min-h-screen dark:bg-background">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-4 text-foreground">{category.name}</h1>
                <p className="text-muted-foreground mb-8">{category.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {category.products.length === 0 ? (
                        <p className="text-muted-foreground">No products available in this category.</p>
                    ) : (
                        category.products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const category = await prisma.category.findFirst({
        where: {
            name: {
                equals: params.slug.charAt(0).toUpperCase() + params.slug.slice(1),
            }
        }
    });

    return {
        title: category ? `${category.name} - Otaku Haven` : 'Category Not Found',
        description: category?.description || 'Category not found',
    };
}