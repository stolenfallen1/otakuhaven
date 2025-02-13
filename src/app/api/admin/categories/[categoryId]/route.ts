import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/utils/jwt";
import { cookies } from "next/headers";

export async function PATCH(request: Request, { params }: { params: { categoryId: string }}) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const payload = await verifyJWT(token);
        if (!payload ||!('id' in payload)) {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: payload.id as string },
            select: { role: true }
        });

        if (!user || user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name } = await request.json();
        if (!name || typeof name !== "string") {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const duplicateCategory = await prisma.category.findFirst({
            where: {
                name,
                NOT: {
                    id: params.categoryId
                }
            }
        });

        if (duplicateCategory) {
            return NextResponse.json({ error: "Category already exists" }, { status: 400 });
        }

        const updatedCategory = await prisma.category.update({
            where: { id: params.categoryId },
            data: { name: name.trim() }
        });

        return NextResponse.json(updatedCategory);

    } catch(error) {
        console.error('Update category error: ', error);
        return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
    }
}