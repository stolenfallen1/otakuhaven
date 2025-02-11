import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyJWT } from "@/utils/jwt";
import { prisma } from "@/lib/prisma";
import { AdminNav } from "./components/admin-nav";

async function getUser(token: string) {
    try {
        const payload = await verifyJWT(token);
        if (!payload || !('id' in payload)) return null;

        const user = await prisma.user.findUnique({
            where: { id: payload.id as string },
            select: { role: true }
        });

        return user;
        
    } catch {
        return null;
    }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        redirect("/sign-in");
    }

    const user = await getUser(token);
    
    if (!user || user.role !== "ADMIN") {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-background">
            <AdminNav />
            <main className="container mx-auto py-6 px-4">
                {children}
            </main>
        </div>
    );
}