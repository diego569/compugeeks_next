"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Banner } from '@/types';

export function BannerCarousel({ banners }: { banners: Banner[] }) {
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [banners.length]);

    const heroBanner = banners[currentBannerIndex];

    return (
        <div className="relative w-full overflow-hidden group">
            <div className="w-full relative overflow-hidden">
                {/* Responsive Image - Shows complete image at first (scale 1) */}
                <img
                    key={currentBannerIndex}
                    src={heroBanner.imageUrl}
                    alt={heroBanner.title}
                    className="w-full h-auto block animate-ken-burns"
                />

                {/* Carousel Indicators */}
                <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {banners.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentBannerIndex(idx)}
                            className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 shadow-sm ${idx === currentBannerIndex ? 'w-6 sm:w-8 bg-primary/90' : 'w-1.5 sm:w-2 bg-white/50 hover:bg-white/80'}`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
