import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: "/admin", destination: "/admin/index.html" }];
  },
  async redirects() {
    // Посты изначально создаются Decap CMS с кириллическим слагом (не
    // транслитерированным) — переименовываем в латиницу вслед за
    // остальными постами, редирект на случай, если кто-то уже успел
    // перейти по кириллической ссылке до переименования.
    //
    // source указан в percent-encoded виде (не сырой кириллицей) — у
    // Next.js обнаружился баг: для source с не-ASCII символами матчинг
    // входящего запроса не срабатывает (см. коммит с decodeURIComponent
    // в [slug]/page.tsx для того же класса бага в generateStaticParams).
    return [
      {
        // /время-любви
        source: "/%D0%B2%D1%80%D0%B5%D0%BC%D1%8F-%D0%BB%D1%8E%D0%B1%D0%B2%D0%B8",
        destination: "/vremya-lyubvi",
        permanent: true,
      },
      {
        // /молитва
        source: "/%D0%BC%D0%BE%D0%BB%D0%B8%D1%82%D0%B2%D0%B0",
        destination: "/molitva",
        permanent: true,
      },
      {
        // /ласка-и-нежность
        source: "/%D0%BB%D0%B0%D1%81%D0%BA%D0%B0-%D0%B8-%D0%BD%D0%B5%D0%B6%D0%BD%D0%BE%D1%81%D1%82%D1%8C",
        destination: "/laska-i-nezhnost",
        permanent: true,
      },
      {
        // /«отец»
        source: "/%C2%AB%D0%BE%D1%82%D0%B5%D1%86%C2%BB",
        destination: "/otec",
        permanent: true,
      },
      {
        // /танцы
        source: "/%D1%82%D0%B0%D0%BD%D1%86%D1%8B",
        destination: "/tancy",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
