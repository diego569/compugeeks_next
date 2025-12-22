import { api } from '@/services/api';
import { Product } from '@/types';
import ProductDetailClient from './ProductDetailClient';
import { Metadata } from 'next';

// Generate Metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const { slug } = await params;
    const product = await api.products.getBySlug(slug);

    if (!product) {
        return {
            title: 'Producto no encontrado | Compugeeks',
        };
    }

    return {
        title: `${product.name} | Compugeeks`,
        description: product.description || `Compra ${product.name} al mejor precio en Compugeeks.`,
        openGraph: {
            title: product.name,
            description: product.description || `Compra ${product.name} al mejor precio.`,
            images: product.productImages && product.productImages[0] ? [product.productImages[0].url] : [],
        },
    };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const product = await api.products.getBySlug(slug);

    if (!product) {
        return (
            <div className="container py-20 text-center text-xl font-medium text-muted-foreground">
                Producto no encontrado
            </div>
        );
    }

    return <ProductDetailClient product={product} />;
}
