import { MetadataRoute } from 'next';
import { api } from '@/services/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://compugeeks.com.pe';

    // Static routes
    const staticRoutes = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/catalogo`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/wishlist`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.3,
        },
    ];

    try {
        // Dynamic categories
        const categories = await api.categories.list();
        const categoryRoutes = categories.map((cat: any) => ({
            url: `${baseUrl}/catalogo/${cat.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));

        // Dynamic products (get first 100 for sitemap)
        const productsData = await api.products.list({ pageSize: 100 });
        const productRoutes = productsData.data.map((prod: any) => ({
            url: `${baseUrl}/producto/${prod.slug}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.6,
        }));

        return [...staticRoutes, ...categoryRoutes, ...productRoutes];
    } catch (error) {
        console.error('Error generating sitemap:', error);
        return staticRoutes;
    }
}
