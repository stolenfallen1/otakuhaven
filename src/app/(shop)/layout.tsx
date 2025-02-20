import HomeHeader from "@/app/(home)/components/home-header";
import { ScrollReset } from "@/components/scroll-reset";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen dark:bg-background">
            <ScrollReset />
            <HomeHeader />
            {children}
        </div>
    );
}