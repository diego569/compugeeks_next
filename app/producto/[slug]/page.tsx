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
        title: `${product.name} - Compugeeks Puno`,
        description: product.description?.slice(0, 160) || `Encuentra ${product.name} en Compugeeks Puno. Los mejores componentes de tecnología con garantía oficial en Puno, Perú.`,
        openGraph: {
            title: `${product.name} | Compugeeks Puno`,
            description: product.description?.slice(0, 160) || `Disponible en Compugeeks Puno con el mejor precio del mercado local.`,
            images: product.productImages?.[0] ? [product.productImages[0].url] : [],
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
