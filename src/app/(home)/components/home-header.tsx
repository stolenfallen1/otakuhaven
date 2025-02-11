import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { cookies } from "next/headers";
import { ClientLogoutButton } from "@/components/client-logout-button";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/utils/jwt";

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

export default async function HomeHeader() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    const user = token ? await getUser(token.value) : null;

    return (
        <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b dark:border-border">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                        OtakuHaven
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    {token ? (
                        <>
                            {user?.role === "ADMIN" && (
                                <Link href="/admin" className="text-foreground/60 hover:text-purple-600 dark:hover:text-purple-400">
                                    Admin Dashboard
                                </Link>
                            )}
                            <Link href="/account" className="text-foreground/60 hover:text-purple-600 dark:hover:text-purple-400">
                                Account
                            </Link>
                            <ClientLogoutButton />
                        </>
                    ) : (
                        <>
                            <Link href="/sign-in" className="text-foreground/60 hover:text-purple-600 dark:hover:text-purple-400">
                                Sign In
                            </Link>
                            <Link href="/sign-up" className="px-4 py-2 bg-purple-600 text-white dark:text-black rounded-md hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600">
                                Sign Up
                            </Link>
                        </>
                    )}
                    <ThemeSwitcher />
                </div>
            </div>
        </nav>
    );
}