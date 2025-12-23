import { api } from '@/services/api';
import { ProductFilterParams, Category } from '@/types';
import CatalogClient from '../CatalogClient';

export default async function CategoryPage({
    params,
    searchParams
}: {
    params: { categorySlug: string };
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const { categorySlug } = await params;
    const searchParamsValues = await searchParams;

    // 1. Resolve slug to ID
    const category = await api.categories.getBySlug(categorySlug);

    // Handle 404 if category not found (optional: use notFound())
    // For now we just return empty or default behavior
    if (!category) {
        // redirect('/catalogo') or show not found component
        return <div>Categoría no encontrada</div>;
    }

    const page = Number(searchParamsValues?.page) || 1;
    const filterParams: ProductFilterParams = {
        page,
        pageSize: 12,
        search: typeof searchParamsValues?.search === 'string' ? searchParamsValues.search : undefined,
        minPrice: searchParamsValues?.minPrice ? Number(searchParamsValues.minPrice) : undefined,
        maxPrice: searchParamsValues?.maxPrice ? Number(searchParamsValues.maxPrice) : undefined,
    };

    // 2. Fetch Recursive Products using ID
    const [productsData, categories] = await Promise.all([
        api.products.listRecursive(category.id, filterParams),
        api.categories.list()
    ]);

    return (
        <CatalogClient
            initialProducts={productsData.data}
            categories={categories}
            initialParams={filterParams}
            categorySlug={categorySlug}
        />
    );
}

// Generate Metadata for SEO
export async function generateMetadata({ params }: { params: { categorySlug: string } }) {
    const { categorySlug } = await params;
    const category = await api.categories.getBySlug(categorySlug);

    if (!category) {
        return {
            title: 'Categoría no encontrada | Compugeeks',
        };
    }

    return {
        title: `${category.name} en Puno, Perú`,
        description: `Compra ${category.name} en Puno con Compugeeks. Los mejores precios y garantía local en el Perú.`,
        keywords: [`${category.name.toLowerCase()} puno`, `${category.name.toLowerCase()} peru`, "compugeeks puno"],
        openGraph: {
            title: `${category.name} | Tecnología en Puno`,
            description: `Variedad de ${category.name} con entrega en Puno y envíos a todo el Perú.`,
            images: category.imageUrl ? [category.imageUrl] : [],
            locale: "es_PE",
            type: "website",
        },
    };
}
