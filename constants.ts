import { Banner } from "./types";

export const WHATSAPP_NUMBER = "51999999999"; // Replace with real number

export const BANNERS: Banner[] = [
  {
    id: "1",
    title: "Navidad Gamer",
    subtitle: "Descuentos increíbles en toda la tienda. ¡Regala tecnología!",
    imageUrl: "https://rematesalinas.com.pe/wp-content/uploads/2025/11/Navidad-Portada-web.png",
    link: "/catalogo",
    ctaText: "Ver Ofertas"
  },
  {
    id: "2",
    title: "Arma tu PC",
    subtitle: "Los mejores componentes para construir el setup de tus sueños.",
    imageUrl: "https://rematesalinas.com.pe/wp-content/uploads/2024/07/arma-tu-pc.png",
    link: "/catalogo/componentes",
    ctaText: "Cotizar Ahora"
  }
];

export const MOCK_CATEGORIES = [
  { id: '1', name: 'Laptops', slug: 'laptops', icon: 'Laptop' },
  { id: '2', name: 'Monitores', slug: 'monitores', icon: 'Monitor' },
  { id: '3', name: 'Componentes', slug: 'componentes', icon: 'Cpu' },
  { id: '4', name: 'Periféricos', slug: 'perifericos', icon: 'Keyboard' },
  { id: '5', name: 'Networking', slug: 'networking', icon: 'Wifi' },
];