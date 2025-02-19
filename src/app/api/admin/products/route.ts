import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/utils/jwt";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const payload = await verifyJWT(token);
        if (!payload || !('id' in payload)) {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: payload.id as string },
            select: { role: true }
        });

        if (!user || user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Create product
        const { name, description, price, stock, image, categoryId } = await request.json();

        // Validate required fields
        if (!name || !description || !price || !stock || !image || !categoryId) {
            return NextResponse.json({ 
                error: "Name, description, price, ,stock, image and category are required" 
            }, { status: 400 });
        }

        // Validate price and stock
        if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
            return NextResponse.json({ error: "Invalid price" }, { status: 400 });
        }

        if (stock !== undefined && (isNaN(parseInt(stock)) || parseInt(stock) < 0)) {
            return NextResponse.json({ error: "Invalid stock value" }, { status: 400 });
        }

        // Verify category exists
        const category = await prisma.category.findUnique({
            where: { id: categoryId }
        });

        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name: name.trim(),
                description: description.trim(),
                price: parseFloat(price),
                stock: stock ? parseInt(stock) : 1,
                image: image?.trim(),
                categoryId
            },
            include: {
                category: true
            }
        });

        return NextResponse.json(product);

    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}