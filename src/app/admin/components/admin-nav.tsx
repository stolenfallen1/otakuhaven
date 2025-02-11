"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/categories", label: "Categories" },
    { href: "/admin/users", label: "Users" },
];

export function AdminNav() {
    const pathname = usePathname();

    return (
        <nav className="border-b dark:border-border">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center gap-6">
                    <section className="mr-8">
                        <Link href="/" className="text-xl font-bold text-purple-600 dark:text-purple-400">
                            OtakuHaven
                        </Link>
                    </section>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${
                                pathname === item.href
                                    ? "text-purple-600 dark:text-purple-400"
                                    : "text-foreground/60 hover:text-purple-600 dark:hover:text-purple-400"
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}