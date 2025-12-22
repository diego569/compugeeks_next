"use client";

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { useWishlist } from '../store/useWishlist';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    // Only access wishlist on client mount/interaction if strict SSR is needed. 
    // However, Zustand usually works if proper provider patterns are used or if we accept hydration mismatches on icons.
    // For icons like "Wishlisted", it's better to show an empty state or load from client effect.
    // We already moved generic layout things to client, but this component is imported in standard "Server Components" page.
    // So 'use client' is required primarily for the onClick handlers.

    // We can assume useWishlist is safe in Client Components. hydration mismatch logic is inside the store/hook if implemented correctly 
    // or we just use 'use client' here and useEffect to verify state if needed.
    // For simplicity we use the hook directly.
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const isWishlisted = isInWishlist(product.id);

    // Fallback image if productImages is empty or undefined
    const mainImage = product.productImages?.[0]?.url || 'https://picsum.photos/400/400';

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isWishlisted) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <div className="group relative rounded-xl border border-border bg-card overflow-hidden hover:border-primary transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:-translate-y-1 flex flex-col h-full">
            {/* Wishlist Button */}
            <button
                onClick={toggleWishlist}
                className={`absolute top-3 right-3 z-10 p-1.5 rounded-full backdrop-blur-sm transition-colors ${isWishlisted
                        ? 'bg-primary text-background hover:bg-primary/80'
                        : 'bg-background/50 text-muted-foreground hover:text-red-500 hover:bg-background'
                    }`}
            >
                <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>

            {/* Image Link */}
            <Link href={`/producto/${product.slug}`} className="block relative aspect-[4/3] bg-white p-6 flex items-center justify-center overflow-hidden">
                <img
                    src={mainImage}
                    alt={product.name}
                    className="object-contain w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
            </Link>

            {/* Info */}
            <div className="p-5 flex flex-col flex-1 gap-3">
                <div className="space-y-1 flex-1">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        {product.category?.name || 'Tecnología'}
                    </p>
                    <Link href={`/producto/${product.slug}`}>
                        <h3 className="font-bold text-foreground leading-tight line-clamp-2 hover:text-primary transition-colors">
                            {product.name}
                        </h3>
                    </Link>
                </div>

                <div className="pt-2 flex items-end justify-between border-t border-border/50">
                    <div>
                        <p className="text-xl font-bold text-primary">
                            S/ {Number(product.sellingPrice).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                    <Link
                        href={`/producto/${product.slug}`}
                        className="h-8 w-8 rounded-full bg-secondary text-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                        <ShoppingCart className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
