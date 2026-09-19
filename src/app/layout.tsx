import type { Metadata } from "next";
import "./globals.css";
import { SITE_URL, SITE_NAME } from "@/lib/seo";
import SiteHeader from "@/components/SiteHeader";
import Link from "next/link";
import { Mail, Youtube } from "lucide-react";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Егор Андреев — современная поэзия о людях, времени, любви и тишине. Стихи, сборники, встречи и чтения.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_NAME,
    description:
      "Егор Андреев — современная поэзия о людях, времени, любви и тишине. Стихи, сборники, встречи и чтения.",
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [{ url: `${SITE_URL}/images/hero-placeholder.jpg`, width: 1881, height: 836 }],
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description:
      "Егор Андреев — современная поэзия о людях, времени, любви и тишине. Стихи, сборники, встречи и чтения.",
    images: [`${SITE_URL}/images/hero-placeholder.jpg`],
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Егор Андреев",
  jobTitle: "Поэт",
  url: SITE_URL,
  sameAs: [
    "https://vk.com/",
    "https://youtube.com/",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className="h-full">
      <head>
        {/* Anti-FOUC: применяем сохранённую тему синхронно, до отрисовки,
            иначе при светлой теме будет заметная вспышка тёмной на долю
            секунды перед гидратацией ThemeToggle. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");if(t==="light")document.documentElement.setAttribute("data-theme","light");}catch(e){}`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root {
            --font-playfair: 'Playfair Display', Georgia, serif;
            --font-cormorant: 'Cormorant Garamond', Georgia, serif;
            /* Кириллическая "подпись": курсив Cormorant Garamond — у
               рукописных Google Fonts (Mrs Saint Delafield и т.п.) нет
               кириллических глифов, для русского текста они не подходят. */
            --font-signature: 'Cormorant Garamond', Georgia, serif;
            --font-inter: 'Inter', system-ui, sans-serif;
          }
        `}</style>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg-base text-paper antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-line bg-bg-deep">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
              <div>
                <span className="font-display text-2xl text-paper">
                  Егор Андреев
                </span>
                <p className="mt-3 text-sm text-paper-muted max-w-xs leading-relaxed">
                  Поэзия всегда рядом.
                </p>
              </div>

              <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-paper-muted">
                <Link href="/#hero" className="hover:text-gold-soft transition-colors">Главная</Link>
                <Link href="/#about" className="hover:text-gold-soft transition-colors">Обо мне</Link>
                <Link href="/#stihi" className="hover:text-gold-soft transition-colors">Стихи</Link>
                <Link href="/#books" className="hover:text-gold-soft transition-colors">Книги</Link>
                <Link href="/#events" className="hover:text-gold-soft transition-colors">События</Link>
                <Link href="/#subscribe" className="hover:text-gold-soft transition-colors">Контакты</Link>
              </nav>

              <div className="flex items-center gap-4">
                <a
                  href="mailto:AndreevBank@bk.ru"
                  aria-label="Email"
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-line text-paper-muted hover:text-gold-soft hover:border-gold/50 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </a>
                {/* TODO: заменить на реальные ссылки на соцсети */}
                <a
                  href="https://vk.com/"
                  aria-label="VK"
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-line text-paper-muted hover:text-gold-soft hover:border-gold/50 transition-colors text-xs font-semibold"
                >
                  VK
                </a>
                <a
                  href="https://youtube.com/"
                  aria-label="YouTube"
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-line text-paper-muted hover:text-gold-soft hover:border-gold/50 transition-colors"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-line text-xs text-paper-muted/70 text-center">
              © {new Date().getFullYear()} Егор Андреев. Все права защищены.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
