import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, WishlistItem } from '../types';
import { WHATSAPP_NUMBER } from '../constants';

interface WishlistState {
  items: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  getWhatsAppLink: () => string;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToWishlist: (product) => {
        const { items } = get();
        if (!items.find((i) => i.product.id === product.id)) {
          set({ items: [...items, { product, addedAt: Date.now() }] });
        }
      },

      removeFromWishlist: (productId) => {
        set({ items: get().items.filter((i) => i.product.id !== productId) });
      },

      isInWishlist: (productId) => {
        return !!get().items.find((i) => i.product.id === productId);
      },

      clearWishlist: () => set({ items: [] }),

      getWhatsAppLink: () => {
        const { items } = get();
        if (items.length === 0) return '';

        let message = `Hola Compugeeks, me interesa cotizar los siguientes productos de su web:\n\n`;
        
        items.forEach((item, index) => {
          message += `${index + 1}. *${item.product.name}*\n`;
          message += `   Precio Web: S/ ${Number(item.product.sellingPrice).toFixed(2)}\n`;
          message += `   ID: ${item.product.id.slice(0, 8)}\n\n`;
        });

        message += `Quedo atento a su respuesta.`;

        return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      }
    }),
    {
      name: 'compugeeks-wishlist',
    }
  )
);
