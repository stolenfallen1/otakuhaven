"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export function ClientLogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        const res = await fetch("/api/auth/logout", {
            method: "POST",
        });

        if (res.ok) {
            localStorage.removeItem("token"); 
            router.refresh();
        }
    }

    return (
        <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="px-4 py-2 bg-purple-600 text-white dark:text-black rounded-md hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
        >
            Logout
        </Button>
    );
}