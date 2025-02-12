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

        // Create category
        const { name } = await request.json();

        if (!name || typeof name !== "string") {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const existingCategory = await prisma.category.findUnique({
            where: { name }
        });

        if (existingCategory) {
            return NextResponse.json({ error: "Category already exists" }, { status: 400 });
        }

        const category = await prisma.category.create({
            data: { name: name.trim() }
        });

        return NextResponse.json(category);

    } catch (error) {
        console.error("Error creating category:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}