import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { SITE_URL, SITE_NAME } from "@/lib/seo";
import SiteHeader from "@/components/SiteHeader";
import HashScroll from "@/components/HashScroll";
import Link from "next/link";
import { Mail, Youtube } from "lucide-react";

// Самохостинг шрифтов через next/font — файлы скачиваются один раз на
// этапе сборки и раздаются со своего домена, без запросов браузера к
// fonts.googleapis.com/fonts.gstatic.com. Устраняет трансграничную
// передачу IP посетителя в Google (см. /privacy) — тот же фикс, что
// сделан на andreev-zakon.ru. Имена переменных совпадают с прежними
// литеральными --font-playfair/--font-cormorant/--font-inter, поэтому
// globals.css почти не пришлось трогать (--font-signature просто
// сослан на --font-cormorant вместо самого себя).
const playfairDisplay = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

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
  verification: {
    google: "i3fALs9aHod9F8c4zgYyngmoFUPqZb16ntqASledJSM",
    yandex: "796f42959d88328c",
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
    <html
      lang="ru"
      className={`h-full ${playfairDisplay.variable} ${cormorantGaramond.variable} ${inter.variable}`}
    >
      <head>
        {/* Anti-FOUC: применяем сохранённую тему синхронно, до отрисовки,
            иначе при светлой теме будет заметная вспышка тёмной на долю
            секунды перед гидратацией ThemeToggle. Вынесен в статический
            файл (а не dangerouslySetInnerHTML инлайном), чтобы CSP мог
            разрешать script-src 'self' без 'unsafe-inline' — со внешним
            файлом это не нужно, а с инлайн-скриптом браузер бы его
            заблокировал. */}
        <script src="/theme-init.js" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg-base text-paper antialiased">
        <HashScroll />
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
                {/* TODO: заменить на страницу контактов, когда Егор пришлёт данные */}
                <Link href="mailto:AndreevBank@bk.ru" className="hover:text-gold-soft transition-colors">Контакты</Link>
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

            <div className="mt-10 pt-6 border-t border-line text-xs text-paper-muted/70 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
              <span>© {new Date().getFullYear()} Егор Андреев. Все права защищены.</span>
              <Link href="/privacy" className="hover:text-gold-soft transition-colors">
                Политика обработки персональных данных
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
