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
  description: "Tu mejor opción en Puno para laptops, componentes de PC y accesorios tecnológicos. Calidad y garantía en el corazón de Puno, Perú.",
  keywords: ["computadoras puno", "laptops puno", "tecnología puno", "componentes pc perú", "tienda tecnologia puno", "compugeeks"],
  authors: [{ name: "Compugeeks" }],
  creator: "Compugeeks",
  publisher: "Compugeeks",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  openGraph: {
    title: "Compugeeks | Tecnología de Vanguardia en Puno",
    description: "Encuentra lo último en laptops, componentes y accesorios en Puno, Perú.",
    url: "https://compugeeks.com.pe",
    siteName: "Compugeeks Puno",
    locale: "es_PE",
    type: "website",
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
