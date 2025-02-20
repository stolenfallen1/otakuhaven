import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: { id: string } }) {
    const product = await prisma.product.findUnique({
        where: { id: params.id },
        include: { category: true }
    });

    if (!product) {
        notFound();
    }

    return (
        <div className="min-h-screen dark:bg-background">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-4 text-foreground">{product.name}</h1>
                <p className="text-muted-foreground mb-8">Category: {product.category.name}</p>
            </div>
        </div>
    );
}