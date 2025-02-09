"use client";

import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function HomeHeader() {
    return (
        <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b dark:border-border">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        OtakuHaven
                    </Link>
                    </div>
                    <div className="flex items-center gap-4">
                    <Link href="/sign-in" className="text-foreground/60 hover:text-purple-600 dark:hover:text-purple-400">
                        Sign In
                    </Link>
                    <Link href="/sign-up" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600">
                        Sign Up
                    </Link>
                    <ThemeSwitcher />
                </div>
            </div>
        </nav>
    );
}