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
    return [
      {
        source: "/время-любви",
        destination: "/vremya-lyubvi",
        permanent: true,
      },
      {
        source: "/молитва",
        destination: "/molitva",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
