"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { AddToCartButton } from "./add-to-cart-button";
import { motion } from "framer-motion";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string | null;
    category: {
        id: string;
        name: string;
    };
}

interface ProductCardProps {
    product: Product;
}

const getColor = (name: string) => {
    switch (name) {
        case 'Collectibles':
            return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
        case 'Manga':
            return 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400';
        case 'Streetwear':
            return 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400';
        case 'Merchandise':
            return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400';
        default:
            return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400';
    }
};

export function ProductCard({ product }: ProductCardProps) {
    return (
        <motion.div 
            initial={{
                opacity: 0,
                scale: 0.8,
                y: 20,
            }}
            whileInView={{
                opacity: 1,
                scale: 1,
                y: 0,
            }}
            transition={{
                duration: 0.4,
                ease: 'easeOut',
                bounceDamping: 0.5,
            }}
            viewport={{ once: true, amount: 0.2 }}
            className="group border dark:border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow bg-card"
        >
            <motion.div 
                className="aspect-square bg-muted rounded-lg mb-4 overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
            >
                {product.image ? (
                    <img 
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50" />
                )}
            </motion.div>
            
            <div className="space-y-1">
                <div className="flex items-center justify-between gap-1">
                    <h2 className="text-xl font-semibold line-clamp-1 text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {product.name}
                    </h2>
                    <span className={`text-xs px-2 py-1 rounded-full ${getColor(product.category.name)}`}>
                        {product.category.name}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <p className="text-md text-purple-600 dark:text-purple-400 font-semibold">₱{product.price}</p>
                    <p className="text-sm text-purple-500/90 dark:text-purple-300/80 font-extralight">{product.stock} pcs. left</p>
                </div>
                <section className="flex space-x-2 lg:space-x-4">
                    <Link 
                        href={`/product/${product.id}`}
                        className="w-full"
                    >
                        <Button 
                            variant="outline"
                            className="w-full border-purple-600 text-purple-600 hover:bg-purple-50 hover:text-purple-700 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-950/50 dark:hover:text-purple-300"
                        >
                            View Details
                        </Button>
                    </Link>
                    <AddToCartButton productId={product.id} />
                </section>
            </div>
        </motion.div>
    );
}