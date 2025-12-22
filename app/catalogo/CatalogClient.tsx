"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, ChevronDown, ChevronRight, Plus, Minus, Box, Laptop, Monitor, Cpu, Keyboard, Wifi } from 'lucide-react';
import { Product, Category, ProductFilterParams } from '@/types';
import ProductCard from '@/components/ProductCard';
import Breadcrumb from '@/components/Breadcrumb';

interface CatalogClientProps {
    initialProducts: Product[];
    categories: Category[];
    initialParams: ProductFilterParams;
    categorySlug?: string;
}

type CategoryWithChildren = Category & { children: CategoryWithChildren[] };

export default function CatalogClient({
    initialProducts,
    categories,
    initialParams,
    categorySlug
}: CatalogClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [loading, setLoading] = useState(false);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [priceRange, setPriceRange] = useState<[number, number]>([
        initialParams.minPrice || 0,
        initialParams.maxPrice || 10000
    ]);
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

    useEffect(() => {
        setProducts(initialProducts);
    }, [initialProducts]);

    // Build Category Tree
    const categoryTree = useMemo(() => {
        const map = new Map<string, CategoryWithChildren>();
        // Initialize map
        categories.forEach(c => map.set(c.id, { ...c, children: [] }));

        const roots: CategoryWithChildren[] = [];
        map.forEach(node => {
            if (node.parentId && map.has(node.parentId)) {
                map.get(node.parentId)!.children.push(node);
            } else if (!node.parentId) {
                roots.push(node);
            }
        });
        return roots;
    }, [categories]);

    // Base Categories (only roots) for top section
    const baseCategories = categoryTree;

    const toggleExpand = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('minPrice', priceRange[0].toString());
        params.set('maxPrice', priceRange[1].toString());
        params.set('page', '1');
        router.push(`?${params.toString()}`);
    };

    // Helper to render tree items recursively
    const renderCategoryTree = (nodes: CategoryWithChildren[], depth = 0) => {
        return (
            <ul className={`space-y-1 ${depth > 0 ? 'ml-4 border-l border-border/50 pl-2' : ''}`}>
                {nodes.map(node => {
                    const isExpanded = expandedCategories[node.id];
                    const hasChildren = node.children.length > 0;
                    const isActive = categorySlug === node.slug;

                    return (
                        <li key={node.id}>
                            <div className={`flex items-center justify-between group rounded-md px-2 py-1.5 transition-colors ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
                                <Link href={`/catalogo/${node.slug}`} className="flex-1 flex items-center gap-2 text-sm">
                                    {/* Icon - Try to use image, else fallback */}
                                    {depth === 0 && (
                                        node.imageUrl ? (
                                            <img src={node.imageUrl} alt="" className="w-5 h-5 object-contain" />
                                        ) : (
                                            <Box className="w-4 h-4 opacity-70" />
                                        )
                                    )}
                                    <span>{node.name}</span>
                                </Link>

                                {hasChildren && (
                                    <button
                                        onClick={(e) => toggleExpand(node.id, e)}
                                        className="p-1 rounded-sm hover:bg-background text-muted-foreground"
                                    >
                                        {isExpanded ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                                    </button>
                                )}
                            </div>

                            {hasChildren && isExpanded && (
                                <div className="mt-1 animate-in slide-in-from-top-2 duration-200">
                                    {renderCategoryTree(node.children, depth + 1)}
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        );
    };

    // Breadcrumbs
    const breadcrumbItems = [
        { label: 'Catálogo', href: '/catalogo' },
    ];
    if (categorySlug) {
        const catName = categories.find(c => c.slug === categorySlug)?.name || categorySlug;
        breadcrumbItems.push({ label: catName });
    }

    return (
        <div className="container pb-20 pt-6">
            <Breadcrumb items={breadcrumbItems} />

            {/* BASE CATEGORIES RAIL (Top Section) */}
            {/* Only show on root catalog page */}
            {!categorySlug && (
                <section className="mb-8">
                    <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide md:mx-0 md:px-0">
                        {baseCategories.map(cat => (
                            <Link
                                key={cat.id}
                                href={`/catalogo/${cat.slug}`}
                                className="shrink-0 group flex flex-col items-center gap-3 bg-card border border-border rounded-xl p-4 w-[160px] h-[180px] shadow-sm hover:shadow-md transition-all hover:border-primary"
                            >
                                <div className="relative w-[100px] h-[100px] flex items-center justify-center overflow-hidden">
                                    {cat.imageUrl ? (
                                        <img
                                            src={cat.imageUrl}
                                            alt={cat.name}
                                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                                        />
                                    ) : (
                                        <Box className="w-12 h-12 text-muted-foreground/30 transition-transform duration-300 group-hover:scale-110" />
                                    )}
                                </div>
                                <div className="w-full h-[40px] flex items-center justify-center">
                                    <span className="font-medium text-sm text-center text-muted-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                        {cat.name}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            <div className="flex flex-col lg:flex-row gap-8">
                {/* SIDEBAR FILTERS (Left) */}
                <aside className={`lg:block w-full lg:w-64 shrink-0 space-y-8 ${showMobileFilters ? 'block' : 'hidden'}`}>

                    {/* Categories Tree */}
                    <div>
                        <h3 className="font-bold text-foreground text-lg mb-4">Categorías</h3>
                        <div className="space-y-1">
                            {renderCategoryTree(categoryTree)}
                        </div>
                    </div>

                    {/* Price Filter */}
                    <div>
                        <h3 className="font-bold text-foreground text-lg mb-4">Precio</h3>
                        <div className="space-y-6">
                            {/* Slider visual representation (mock) */}
                            <div className="relative h-2 w-full bg-secondary rounded-full">
                                <div className="absolute left-0 right-0 h-full bg-primary rounded-full" style={{ left: '0%', right: '0%' }}></div>
                                <div className="absolute top-1/2 -translate-y-1/2 left-0 h-5 w-5 bg-background border-2 border-primary rounded-full shadow cursor-pointer hover:scale-110 transition-transform"></div>
                                <div className="absolute top-1/2 -translate-y-1/2 right-0 h-5 w-5 bg-background border-2 border-primary rounded-full shadow cursor-pointer hover:scale-110 transition-transform"></div>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center border border-input rounded-md px-3 py-2 bg-background focus-within:ring-1 focus-within:ring-primary">
                                        <span className="text-muted-foreground mr-1 text-sm">S/</span>
                                        <input
                                            type="number"
                                            value={priceRange[0]}
                                            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                            className="w-full text-sm bg-transparent outline-none"
                                            placeholder="Min"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center border border-input rounded-md px-3 py-2 bg-background focus-within:ring-1 focus-within:ring-primary">
                                        <span className="text-muted-foreground mr-1 text-sm">S/</span>
                                        <input
                                            type="number"
                                            value={priceRange[1]}
                                            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                            className="w-full text-sm bg-transparent outline-none text-right"
                                            placeholder="Max"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={applyFilters}
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 rounded-md transition-colors text-sm shadow-sm"
                            >
                                Aplicar filtro
                            </button>
                        </div>

                        <div className="border-b border-border mt-8"></div>
                    </div>

                    {/* Brands Filter (Mock based on Figma) */}
                    <div>
                        <h3 className="font-bold text-foreground text-lg mb-4">Marcas</h3>
                        <div className="space-y-3">
                            {['HP', 'Lenovo', 'ASUS', 'MSI', 'Apple'].map((brand, i) => (
                                <label key={i} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground cursor-pointer group">
                                    <div className="h-4 w-4 rounded border border-input flex items-center justify-center group-hover:border-primary transition-colors bg-background">
                                        {i === 0 && <div className="h-2.5 w-2.5 bg-primary rounded-[1px]" />}
                                    </div>
                                    <span>{brand}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <main className="flex-1">



                    {/* Toolbar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-card border border-border p-4 rounded-lg shadow-sm">
                        <div>
                            <h1 className="text-lg font-bold capitalize">
                                {categorySlug ? (categories.find(c => c.slug === categorySlug)?.name || categorySlug) : 'Catálogo Completo'}
                            </h1>
                            <p className="text-xs text-muted-foreground">
                                {products.length} productos encontrados
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowMobileFilters(!showMobileFilters)}
                                className="lg:hidden flex items-center gap-2 text-sm font-medium bg-secondary px-3 py-2 rounded-md border border-input hover:bg-secondary/80"
                            >
                                <Filter className="h-4 w-4" /> Filtros
                            </button>

                            <div className="relative">
                                <select className="appearance-none h-9 pl-3 pr-8 rounded-md bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer text-foreground">
                                    <option>Relevancia</option>
                                    <option>Menor Precio</option>
                                    <option>Mayor Precio</option>
                                </select>
                                <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 pointer-events-none text-muted-foreground" />
                            </div>
                        </div>
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {products.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-card rounded-xl border border-border">
                            <h3 className="text-xl font-medium text-muted-foreground">No se encontraron productos</h3>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
