import { Product, Category, ProductFilterParams } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3081/api";
const BASE_URL = API_BASE_URL.replace('/api', ''); // Get root URL for static assets
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWl6MGJsbDAwMDAxc2MybnJjYWJpenVsIiwiaWF0IjoxNzY2MzczOTQ0fQ.YdJae2pJkFUpjG4uM-wQGN1PUT3GGP9oMZ8IRc1Tnyw";
//const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWl6MGJsbDAwMDAxc2MybnJjYWJpenVsIiwiaWF0IjoxNzY1NDU3MzA4fQ.4THqKWgWgDdTh_SoLbyN1XF8LAznfFmKAdLhNh0dElQ";

const checkImageUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    // Assuming relative path needs to be prepended with BASE_URL
    // Ensure we don't double slash if url starts with /
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    return `${BASE_URL}${cleanUrl}`;
};

const getHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${TOKEN}`
});

const mapBackendProductToFrontend = (bkProduct: any): Product => {
    return {
        id: bkProduct.id,
        name: bkProduct.name,
        slug: bkProduct.slug,
        sellingPrice: bkProduct.sellingPrice,
        description: bkProduct.description,
        categoryId: bkProduct.category?.id || bkProduct.categoryId,
        isActive: true, // Assuming active if returned
        productImages: bkProduct.productImages?.map((img: any) => ({
            id: img.id,
            url: checkImageUrl(img.url),
            order: img.order || 0
        })) || []
    };
};

export const api = {
    products: {
        list: async (params: ProductFilterParams = {}) => {
            const query = new URLSearchParams();
            query.append("inventoryManaged", "all");
            if (params.page) query.append("page", params.page.toString());
            if (params.pageSize) query.append("pageSize", params.pageSize.toString());
            if (params.search) query.append("search", params.search);
            // Backend might not support minPrice/maxPrice directly as these names, 
            // but we pass them if the dashboard supported similar filters or we fit the pattern.
            if (params.minPrice) query.append("minPrice", params.minPrice.toString());
            if (params.maxPrice) query.append("maxPrice", params.maxPrice.toString());
            if (params.categoryId) query.append("categoryId", params.categoryId);

            try {
                const res = await fetch(`${API_BASE_URL}/products?${query.toString()}`, {
                    headers: getHeaders()
                });

                if (!res.ok) throw new Error("Failed to fetch products");

                const data = await res.json();
                // Backend returns { rows: [], pagination: { total, page, pageSize, totalPages } }
                const products = (data.rows || []).map(mapBackendProductToFrontend);

                return {
                    data: products,
                    total: data.pagination?.total || products.length
                };
            } catch (error) {
                console.error("API error:", error);
                return { data: [], total: 0 };
            }
        },
        getById: async (id: string) => {
            try {
                const res = await fetch(`${API_BASE_URL}/products/${id}`, {
                    headers: getHeaders()
                });
                if (!res.ok) throw new Error("Failed to fetch product");
                const data = await res.json();
                return mapBackendProductToFrontend(data);
            } catch (error) {
                console.error("API error:", error);
                return null;
            }
        },
        getBySlug: async (slug: string) => {
            try {
                const res = await fetch(`${API_BASE_URL}/products/slug/${slug}`, {
                    headers: getHeaders()
                });
                if (!res.ok) throw new Error("Failed to fetch product by slug");
                const data = await res.json();
                return mapBackendProductToFrontend(data);
            } catch (error) {
                console.error("API error:", error);
                return null;
            }
        },
        listRecursive: async (categoryId: string, params: ProductFilterParams = {}) => {
            const query = new URLSearchParams();
            // We assume recursive endpoint supports these filters
            query.append("inventoryManaged", "all"); // Keep consistent with list()
            if (params.page) query.append("page", params.page.toString());
            if (params.pageSize) query.append("pageSize", params.pageSize.toString());
            if (params.search) query.append("search", params.search);
            if (params.minPrice) query.append("minPrice", params.minPrice.toString());
            if (params.maxPrice) query.append("maxPrice", params.maxPrice.toString());

            try {
                const res = await fetch(`${API_BASE_URL}/products/category/${categoryId}/recursive?${query.toString()}`, {
                    headers: getHeaders()
                });

                if (!res.ok) throw new Error("Failed to fetch recursive products");

                const data = await res.json();
                // Backend returns { rows: [], pagination: ... } similar to list
                const products = (data.rows || []).map(mapBackendProductToFrontend);

                return {
                    data: products,
                    total: data.pagination?.total || products.length
                };
            } catch (error) {
                console.error("API error:", error);
                return { data: [], total: 0 };
            }
        }
    },
    categories: {
        list: async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/categories`, {
                    headers: getHeaders()
                });
                if (!res.ok) throw new Error("Failed to fetch categories");
                const data = await res.json();
                // Expecting { rows: [] } or []
                const list = Array.isArray(data) ? data : (data.rows || []);

                return list.map((c: any) => ({
                    id: c.id,
                    name: c.name,
                    slug: c.slug || c.name.toLowerCase().replace(/ /g, '-'),
                    imageUrl: checkImageUrl(c.image || c.imageUrl),
                    parentId: c.parentId || null
                }));
            } catch (error) {
                console.error("API error:", error);
                return [];
            }
        },
        getBySlug: async (slug: string) => {
            try {
                const res = await fetch(`${API_BASE_URL}/categories`, {
                    headers: getHeaders()
                });
                if (!res.ok) throw new Error("Failed to fetch categories");
                const data = await res.json();
                const list = Array.isArray(data) ? data : (data.rows || []);
                const match = list.find((c: any) => c.slug === slug || (c.name && c.name.toLowerCase().replace(/ /g, '-') === slug));

                if (match) {
                    return {
                        id: match.id,
                        name: match.name,
                        slug: match.slug || match.name.toLowerCase().replace(/ /g, '-'),
                        imageUrl: checkImageUrl(match.image)
                    };
                }
                return null;
            } catch (error) {
                console.error("API error:", error);
                return null;
            }
        }
    }
};
