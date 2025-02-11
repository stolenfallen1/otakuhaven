import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/utils/jwt";
import { cookies } from "next/headers";
import { verifyPassword, hashPassword } from "@/utils/hash_password";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        
        const payload = await verifyJWT(token);
        if (!payload || !('id' in payload)) {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: payload.id as string },
            select: {
                id: true,
                name: true,
                email: true,
                emailVerified: true,
                role: true,
            }
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);

    } catch(error) {
        console.error('Get profile error: ', error);
        return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const payload = await verifyJWT(token);
        if (!payload || !('id' in payload)) {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }

        const data = await request.json();
        const updateData: any = {};

        if (data.name) {
            updateData.name = data.name;
        }

        if (data.currentPassword && data.newPassword) {
            const user = await prisma.user.findUnique({
                where: { id: payload.id as string },
                select: { password: true }
            });

            if (!user) {
                return NextResponse.json({ message: "User not found" }, { status: 404 });
            }

            const isValid = await verifyPassword(data.currentPassword, user.password);
            if (!isValid) {
                return NextResponse.json({ message: "Current Password is Incorrect" }, { status: 401 });
            }

            updateData.password = await hashPassword(data.newPassword);
        }

        const updatedUser = await prisma.user.update({
            where: { id: payload.id as string },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                emailVerified: true,
                role: true,
            }
        });

        return NextResponse.json(updatedUser);

    } catch(error) {
        console.error('Update profile error: ', error);
        return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
    }
}