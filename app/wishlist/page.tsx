"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2, MessageCircle } from 'lucide-react';
import { useWishlist } from '@/store/useWishlist';

export default function WishlistPage() {
    const { items, removeFromWishlist, clearWishlist, getWhatsAppLink } = useWishlist();
    const [isMounted, setIsMounted] = useState(false);

    // Prevent hydration errors by waiting for mount
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return <div className="container py-20 text-center">Cargando favoritos...</div>;

    if (items.length === 0) {
        return (
            <div className="container py-20 flex flex-col items-center justify-center text-center space-y-4">
                <h2 className="text-2xl font-bold">Tu lista de favoritos está vacía</h2>
                <p className="text-muted-foreground">Agrega productos para solicitar una cotización.</p>
                <Link href="/catalogo" className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90">
                    Ir al Catálogo
                </Link>
            </div>
        );
    }

    return (
        <div className="container py-10 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Mis Favoritos</h1>
                <button
                    onClick={clearWishlist}
                    className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1"
                >
                    <Trash2 className="h-4 w-4" /> Limpiar lista
                </button>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border mb-8">
                {items.map(({ product }) => (
                    <div key={product.id} className="p-4 flex gap-4 items-center">
                        <div className="h-16 w-16 bg-white rounded-md p-1 shrink-0">
                            <img
                                src={product.productImages?.[0]?.url || 'https://picsum.photos/200'}
                                alt={product.name}
                                className="w-full h-full object-contain mix-blend-multiply"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{product.name}</h3>
                            <p className="text-primary font-bold">S/ {Number(product.sellingPrice).toFixed(2)}</p>
                        </div>
                        <button
                            onClick={() => removeFromWishlist(product.id)}
                            className="p-2 hover:bg-secondary rounded-full text-muted-foreground hover:text-red-400 transition-colors"
                        >
                            <Trash2 className="h-5 w-5" />
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex justify-end">
                <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-green-500/20 flex items-center gap-2 transition-transform hover:scale-105"
                >
                    <MessageCircle className="h-6 w-6" />
                    Cotizar por WhatsApp
                </a>
            </div>
        </div>
    );
}
