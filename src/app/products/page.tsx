import { CategoriesSheet } from "@/components/categories-sheet";

export default function ProductPage() {
    return (
        <div className="min-h-screen dark:bg-background">
            <div className="container mx-auto px-4 py-16">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-foreground">All Products</h1>
                    <CategoriesSheet />
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Product listing will go here */}
                    <p className="text-muted-foreground">Products coming soon...</p>
                </div>
            </div>
        </div>
    );
}