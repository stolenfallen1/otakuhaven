import { categories } from "@/constants/categories";
import { notFound } from "next/navigation";

export default function CategoryPage({ params }: { params: { slug: string }; }) {
    const category = categories.find(
        (cat) => cat.slug === params.slug
    );

    if (!category) {
        notFound();
    }

    return (
        <div className="min-h-screen dark:bg-background">
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold mb-4 text-foreground">{category.name}</h1>
                <p className="text-muted-foreground mb-8">{category.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Product listing for this category will go here */}
                    <p className="text-muted-foreground">Products coming soon...</p>
                </div>
            </div>
        </div>
    );
}

export function generateStaticParams() {
    return categories.map((category) => ({
        slug: category.slug,
    }));
}