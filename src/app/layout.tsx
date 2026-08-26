import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: "Личный блог Егора Андреева: стихи и песни на его стихи.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,500&family=Lora:ital,wght@0,400;0,500;1,400&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root {
            --font-playfair: 'Playfair Display', Georgia, serif;
            --font-lora: 'Lora', Georgia, serif;
            --font-inter: 'Inter', system-ui, sans-serif;
          }
        `}</style>
      </head>
      <body className="min-h-full flex flex-col bg-paper text-text antialiased">
        <header className="border-b border-line">
          <div className="mx-auto max-w-2xl px-4 py-6 flex items-baseline justify-between">
            <Link href="/" className="flex items-baseline gap-3">
              <span className="font-display text-2xl text-ink">
                Егор Андреев
              </span>
              <span className="text-sm text-text-muted">стихи и песни</span>
            </Link>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-line mt-16">
          <div className="mx-auto max-w-2xl px-4 py-8 text-sm text-text-muted text-center">
            © {new Date().getFullYear()} Егор Андреев
          </div>
        </footer>
      </body>
    </html>
  );
}
