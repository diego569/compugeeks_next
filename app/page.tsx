
import { api } from '@/services/api';
import { BANNERS } from '@/constants';
import Link from 'next/link';
import { ChevronRight, Box } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { BannerCarousel } from '@/components/BannerCarousel';
import { Category, Product } from '@/types';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  // Parallel Data Fetching (Server-Side)
  // Typescript might infer return types from api calls, but implicit 'any' warnings come from map callbacks usually if strict mode is on 
  // or if the array type isn't properly inferred.
  const [latestProductsData, categoriesData] = await Promise.all([
    api.products.list({ pageSize: 4 }),
    api.categories.list(),
  ]);

  const latestProducts = latestProductsData.data;
  const categories = categoriesData.filter((c: Category) => !c.parentId);

  return (
    <div className="flex flex-col gap-12 pb-10">
      {/* HERO SECTION - Client Component for auto-rotation */}
      <section className="w-full">
        <BannerCarousel banners={BANNERS} />
      </section>

      {/* CATEGORIES */}
      <section className="container space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Explorar por Categoría</h2>
          <Link href="/catalogo" className="text-sm text-primary hover:underline underline-offset-4 flex items-center">
            Ver todo <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-10 gap-x-6 px-4 sm:px-0">
          {categories.map((cat: Category) => (
            <Link
              key={cat.id}
              href={`/catalogo/${cat.slug}`}
              className="group relative flex items-center bg-white/80 dark:bg-card/50 border border-border/50 rounded-xl p-3 h-[90px] w-full transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:bg-white dark:hover:bg-card overflow-visible"
            >
              {/* Product Image Container with Glow Anchor */}
              <div className="relative w-1/3 h-full flex items-center justify-center shrink-0">
                {/* Glow Anchor (Celeste circle) */}
                <div className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-primary/5 blur-md group-hover:bg-primary/20 group-hover:blur-xl transition-all duration-500 scale-100 group-hover:scale-150"></div>

                {/* Image Pop-Out */}
                <div className="relative z-10 transition-all duration-300 ease-out transform group-hover:scale-125 group-hover:-translate-y-4 group-hover:-translate-x-2 drop-shadow-md group-hover:drop-shadow-2xl">
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.name} className="h-16 w-full object-contain" />
                  ) : (
                    <Box className="h-10 w-10 text-muted-foreground/40" />
                  )}
                </div>
              </div>

              {/* Category Name */}
              <div className="flex-1 pl-4">
                <span className="text-base font-bold text-foreground/80 group-hover:text-primary transition-colors duration-300 leading-tight block">
                  {cat.name}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold group-hover:text-primary/60 transition-colors">
                  Explorar
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* LATEST ARRIVALS */}
      <section className="container space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Últimos Ingresos</h2>
            <p className="text-muted-foreground text-sm">Lo más nuevo en tecnología.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

