import { api } from '@/services/api';
import { ProductFilterParams } from '@/types';
import CatalogClient from './CatalogClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Catálogo de Productos",
    description: "Explora nuestra amplia gama de laptops, componentes de PC y periféricos en Puno. Los mejores precios y las mejores marcas.",
};

// Use standard Next.js page props pattern
// We can fetch data here on server for SEO
// But Catalog implies heavy filtering (search, price, etc.) which often stays client side or uses URL query params.
// For SEO, the initial load should be server-side.

export default async function CatalogPage({
    searchParams
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    // Await searchParams as required in Next.js 15+ (if using recent versions)
    // But standard Next.js 14/15 handling:
    const params = await searchParams; // Wait if it's a promise (Next 15)
    // Note: searchParams is a plain object in Next 14, a Promise in Next 15. Safe to await.

    const page = Number(params?.page) || 1;
    const filterParams: ProductFilterParams = {
        page,
        pageSize: 12,
        search: typeof params?.search === 'string' ? params.search : undefined,
        minPrice: params?.minPrice ? Number(params.minPrice) : undefined,
        maxPrice: params?.maxPrice ? Number(params.maxPrice) : undefined,
    };

    // Fetch initial data
    const [productsData, categories] = await Promise.all([
        api.products.list(filterParams),
        api.categories.list()
    ]);

    return (
        <CatalogClient
            initialProducts={productsData.data}
            categories={categories}
            initialParams={filterParams}
        />
    );
}
