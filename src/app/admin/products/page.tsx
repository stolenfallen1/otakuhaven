import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { ProductDialog } from "./components/product-dialog";

export default async function ProductsPage() {
    // const products = await prisma.product.findMany({
    //     include: {
    //         category: true
    //     }
    // });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Products Management</h1>
                <ProductDialog />
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
                        {/* {products.map((product) => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{product.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{product.category.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">${product.price}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{product.stock}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                    <Link href={`/admin/products/${product.id}/edit`}>
                                        <Button variant="outline" size="sm">Edit</Button>
                                    </Link>
                                    <Button variant="destructive" size="sm">Delete</Button>
                                </td>
                            </tr>
                        ))} */}
                    </tbody>
                </table>
            </div>
        </div>
    );
}