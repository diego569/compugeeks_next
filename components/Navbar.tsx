"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Heart, User, Menu, X, Sun, Moon, Monitor, Cpu } from 'lucide-react';
import { useWishlist } from '../store/useWishlist';
import { useTheme } from '../context/ThemeContext';

const Navbar: React.FC = () => {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    // Use optional chaining or ensure store is ready. Zustand in Next.js Client Components works fine conceptually,
    // but hydration mismatch can occur if persisted. 
    // For now we assume standard usage, but if hydration fails we might need a useEffect wrapper.
    const wishlistItems = useWishlist((state) => state.items);
    const { theme, setTheme } = useTheme();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/catalogo?search=${encodeURIComponent(searchTerm)}`);
            setIsMenuOpen(false);
        }
    };

    const toggleThemeMenu = () => setIsThemeMenuOpen(!isThemeMenuOpen);

    const handleSetTheme = (t: 'light' | 'dark' | 'system') => {
        setTheme(t);
        setIsThemeMenuOpen(false);
    };

    // Hydration check for wishlist items count could be added if needed, 
    // but let's try direct usage first.

    return (
        <header className="w-full">
            {/* Row 1: Static Info */}
            <div className="bg-background border-b border-border/50 py-1.5 text-center">
                <p className="text-[13px] md:text-sm font-bold tracking-tight text-foreground/90">
                    Orgullosos de ser <span className="text-primary uppercase tracking-wider">Puneños</span>
                </p>
            </div>

            {/* Row 2: Announcement Marquee */}
            <div className="bg-[#020817] text-white py-2 overflow-hidden border-b border-white/5 select-none">
                <div className="animate-marquee">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="flex items-center space-x-12 px-6">
                            <span className="text-[11px] md:text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                <span className="text-yellow-400">🔥</span> Remates de Navidad hasta agotar stock
                            </span>
                            <span className="text-[11px] md:text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                <span className="text-primary">✦</span> Tienda 100% Puneña
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Row 3: Main Navigation - Sticky */}
            <nav className="sticky top-0 z-50 w-full glass shadow-sm">
                <div className="container mx-auto px-4 md:px-6 flex h-20 items-center justify-between gap-4">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
                        <div className="relative overflow-hidden p-1">
                            <img
                                src="/CompuGeeks_logo.svg"
                                alt="CompuGeeks Logo"
                                className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
                            />
                        </div>
                        <span className="font-extrabold text-2xl tracking-tighter hidden sm:block">
                            <span className="text-foreground">Compu</span><span className="text-primary">geeks</span>
                        </span>
                    </Link>

                    {/* Desktop Search */}
                    <div className="hidden md:flex flex-1 max-w-2xl items-center">
                        <form onSubmit={handleSearch} className="relative w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex h-11 w-full rounded-full border border-border bg-muted/30 px-5 py-2 pl-11 text-sm placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all"
                            />
                        </form>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 md:gap-3">
                        {/* Theme Toggle */}
                        <div className="relative">
                            <button
                                onClick={toggleThemeMenu}
                                className="inline-flex items-center justify-center rounded-full h-10 w-10 hover:bg-muted transition-colors"
                                aria-label="Toggle theme"
                            >
                                {theme === 'light' ? (
                                    <Sun className="h-5 w-5" />
                                ) : theme === 'dark' ? (
                                    <Moon className="h-5 w-5" />
                                ) : (
                                    <Monitor className="h-5 w-5" />
                                )}
                            </button>

                            {/* Dropdown Menu */}
                            {isThemeMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsThemeMenuOpen(false)}></div>
                                    <div className="absolute right-0 top-full mt-2 w-36 bg-card border border-border rounded-lg shadow-xl z-20 p-1.5 animate-in fade-in zoom-in-95 duration-200">
                                        <button onClick={() => handleSetTheme('light')} className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors ${theme === 'light' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                                            <Sun className="h-4 w-4" /> Claro
                                        </button>
                                        <button onClick={() => handleSetTheme('dark')} className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors ${theme === 'dark' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                                            <Moon className="h-4 w-4" /> Oscuro
                                        </button>
                                        <button onClick={() => handleSetTheme('system')} className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors ${theme === 'system' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                                            <Monitor className="h-4 w-4" /> Sistema
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Wishlist */}
                        <Link href="/wishlist" className="inline-flex items-center justify-center rounded-full h-10 w-10 hover:bg-muted relative transition-colors">
                            <Heart className="h-5 w-5" />
                            {wishlistItems && wishlistItems.length > 0 && (
                                <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-primary border-2 border-background"></span>
                            )}
                        </Link>

                        {/* Account */}
                        <button className="hidden sm:inline-flex items-center justify-center rounded-full h-10 w-10 hover:bg-muted transition-colors">
                            <User className="h-5 w-5" />
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden inline-flex items-center justify-center rounded-full h-10 w-10 hover:bg-muted"
                        >
                            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden p-4 border-t border-border bg-background animate-in slide-in-from-top-4 duration-300">
                        <form onSubmit={handleSearch} className="relative w-full mb-4">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex h-11 w-full rounded-full border border-border bg-muted/50 px-4 py-2 pl-10 text-sm"
                            />
                        </form>
                        <div className="flex flex-col gap-1">
                            <Link href="/catalogo" className="px-4 py-3 hover:bg-muted rounded-xl transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Catálogo Completo</Link>
                            <Link href="/catalogo/laptops" className="px-4 py-3 hover:bg-muted rounded-xl transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Laptops</Link>
                            <Link href="/catalogo/componentes" className="px-4 py-3 hover:bg-muted rounded-xl transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Componentes</Link>
                            <Link href="/wishlist" className="px-4 py-3 text-primary hover:bg-muted rounded-xl transition-colors font-bold" onClick={() => setIsMenuOpen(false)}>
                                Favoritos ({wishlistItems?.length || 0})
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Navbar;