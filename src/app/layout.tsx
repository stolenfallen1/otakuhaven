import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { CartMigrationProvider } from "@/components/cart-migration-provider";
import { cookies } from "next/headers";
import { verifyJWT } from "@/utils/jwt";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OtakuHaven",
  description: "Ecommerce app for Otaku / Weebs to buy anime stuffs",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  let userId: string | null = null;

  if (token) {
    try {
      const payload = await verifyJWT(token);
      if (payload && 'id' in payload) {
        userId = payload.id as string;
      }
    } catch (error) {
      console.error("Error verifying token:", error);
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider 
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CartMigrationProvider userId={userId}>
            {children}
          </CartMigrationProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
