import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import HomeHeader from "./components/home-header";
import Footer from "@/components/footer";
import { ProductCard } from "@/components/product-card";

export default async function Home() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const featuredProducts = await prisma.product.findMany({
    where: { featured: true },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen dark:bg-background">
      {/* Navigation Bar */}
      <HomeHeader />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/10 dark:to-pink-950/10">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 text-foreground">Welcome to OtakuHaven</h1>
            <p className="text-xl text-muted-foreground mb-8">Your ultimate destination for anime merchandise and collectibles</p>
            <Link href="/products">
              <Button className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-lg px-8 py-6">
                Explore Collection
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-foreground">Featured Products</h2>
          <Link href="products/featured">
            <Button variant="outline" className="border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-950/50">
              View All
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts
            .sort(() => Math.random() - 0.5)
            .slice(0, 6)
            .map((product) => (
              <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      {/* Categories Section */}
      <section className="bg-muted/50 dark:bg-muted/10 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link 
                href={`/products/${category.name.toLowerCase()}`}
                key={category.id}
                className="bg-card p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center border dark:border-border hover:border-purple-400 dark:hover:border-purple-400"
              >
                <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
                <p className="text-sm text-muted-foreground mt-2">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-card border-t dark:border-border">
        <Footer />
      </footer>
    </div>
  );
}