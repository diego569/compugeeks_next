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
  title: "Compugeeks | Next-Gen Tech Store",
  description: "Your best source for computer parts, laptops, and accessories.",
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
