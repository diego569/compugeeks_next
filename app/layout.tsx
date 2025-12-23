import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Compugeeks | Tienda de Tecnología en Puno, Perú",
    template: "%s | Compugeeks Puno"
  },
  description: "La mejor tienda de tecnología en Puno, Perú. Venta de laptops, componentes de PC, accesorios y más con garantía asegurada.",
  keywords: ["tecnologia puno", "laptops puno", "computadoras peru", "compugeeks", "partes de pc puno", "gaming puno", "tienda informatica puno"],
  authors: [{ name: "Compugeeks" }],
  creator: "Compugeeks",
  publisher: "Compugeeks",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: "https://compugeeks.com.pe",
    siteName: "Compugeeks Puno",
    title: "Compugeeks | Tecnología de Vanguardia en Puno, Perú",
    description: "Expertos en Laptops, PC Gamers y Componentes en la ciudad de Puno. Envíos y garantía local.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compugeeks | Tecnología en Puno, Perú",
    description: "Tu mejor opción en tecnología en el sur del Perú.",
  },
  icons: {
    icon: "/CompuGeeks_logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased text-foreground bg-background`}>
        <ThemeProvider defaultTheme="light" storageKey="compugeeks-theme">
          {/* Background Pattern */}
          <div className="fixed inset-0 z-[-1] bg-background bg-[size:40px_40px] bg-grid-pattern opacity-[0.1] pointer-events-none"></div>

          <div className="min-h-screen flex flex-col transition-colors duration-300">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 pt-6">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
