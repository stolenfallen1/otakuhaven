import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Link from "next/link"

export async function CategoriesSheet() {
    const categories = await prisma.category.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className="border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400">
                    Categories
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Shop by Category</SheetTitle>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    {categories.map((category) => (
                        <Link
                            href={`/products/${category.name.toLowerCase()}`}
                            key={category.id}
                            className="p-4 rounded-lg hover:bg-muted transition-colors"
                        >
                            <h3 className="text-lg font-semibold">{category.name}</h3>
                            <p className="text-sm text-muted-foreground">{category.description}</p>
                        </Link>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    )
}