export interface PaginationParams {
    page?: number;
    pageSize?: number;
}

export interface ProductFilterParams extends PaginationParams {
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    categoryId?: string;
    tagId?: string;
    attributeValueIds?: string; // Comma separated UUIDs
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    imageUrl?: string;
    description?: string;
    parentId?: string | null;
}

export interface ProductImage {
    id: string;
    url: string;
    order: number;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    sellingPrice: string | number; // Decimal comes as string often from APIs
    purchasePrice?: string | number;
    description?: string;
    categoryId: string;
    isActive: boolean;
    productImages?: ProductImage[];
    category?: Category;
    // Simplified for frontend display
    tags?: { id: string; name: string }[];
}

export interface Attribute {
    id: string;
    name: string;
    values: { id: string; name: string }[];
}

export interface Banner {
    id: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    link: string;
    ctaText: string;
}

export interface WishlistItem {
    product: Product;
    addedAt: number;
}
