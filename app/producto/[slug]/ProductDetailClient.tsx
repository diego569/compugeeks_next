"use client";

import React from 'react';
import { Heart, Check, ShieldCheck, Truck, Store } from 'lucide-react';
import { Product } from '@/types';
import { useWishlist } from '@/store/useWishlist';
import Breadcrumb from '@/components/Breadcrumb';

interface ProductDetailClientProps {
    product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
    // Client Side logic for interactivity (Wishlist)
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const isWishlisted = isInWishlist(product.id);
    const mainImage = product.productImages?.[0]?.url || 'https://picsum.photos/800/800';

    const toggleWishlist = () => {
        if (isWishlisted) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    // Construct Breadcrumbs
    const categoryName = product.category?.name || 'Producto';
    const categorySlug = product.category?.slug || 'productos';

    const breadcrumbItems = [
        { label: 'Catálogo', href: '/catalogo' },
        { label: categoryName, href: `/catalogo/${categorySlug}` },
        { label: product.name }
    ];

    return (
        <div className="container pb-16 pt-6">
            <Breadcrumb items={breadcrumbItems} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

                {/* IMAGE COLUMN */}
                <div className="space-y-4">
                    <div className="relative aspect-square md:aspect-[4/3] rounded-2xl border border-border bg-card/50 flex items-center justify-center p-8 overflow-hidden bg-white">
                        <img
                            src={mainImage}
                            alt={product.name}
                            className="object-contain w-full h-full mix-blend-multiply drop-shadow-[0_0_30px_rgba(0,0,0,0.1)]"
                        />
                    </div>
                </div>

                {/* INFO COLUMN */}
                <div className="flex flex-col gap-6">
                    <div className="space-y-2">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-tight">
                            {product.name}
                        </h1>
                        <div className="flex items-center gap-4">
                            <div className="text-4xl font-bold text-primary tracking-tight">
                                S/ {Number(product.sellingPrice).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 border-t border-border pt-4">
                        <div className="flex items-center gap-2 text-sm text-green-400">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                            </span>
                            Disponible
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            {product.description || "Sin descripción disponible para este producto."}
                        </p>
                    </div>

                    {/* ACTIONS */}
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <button
                                onClick={toggleWishlist}
                                className={`flex-1 font-semibold h-12 rounded-md flex items-center justify-center gap-2 transition-all neon-shadow ${isWishlisted
                                        ? 'bg-secondary text-foreground border border-primary'
                                        : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                                    }`}
                            >
                                {isWishlisted ? (
                                    <>
                                        <Check className="h-5 w-5" /> Agregado a Favoritos
                                    </>
                                ) : (
                                    <>
                                        <Heart className="h-5 w-5" /> Añadir a Favoritos
                                    </>
                                )}
                            </button>
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                            *Agrega a favoritos para cotizar por WhatsApp
                        </p>
                    </div>

                    {/* FEATURES */}
                    <div className="grid grid-cols-2 gap-4 py-4 border-t border-border">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-secondary rounded-full"><Store className="h-4 w-4 text-primary" /></div>
                            <span className="text-xs font-medium text-muted-foreground">Recojo en tienda</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-secondary rounded-full"><ShieldCheck className="h-4 w-4 text-primary" /></div>
                            <span className="text-xs font-medium text-muted-foreground">Garantía Asegurada</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-secondary rounded-full"><Truck className="h-4 w-4 text-primary" /></div>
                            <span className="text-xs font-medium text-muted-foreground">Envíos a todo el Perú</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
