import { NextResponse } from "next/server";

// Отдаёт netlify-identity-widget.js со своего домена (не напрямую с CDN)
// и вырезает хвост, который безусловно сам вызывает netlifyIdentity.init()
// с дефолтным (относительным) APIUrl сразу при загрузке скрипта. На сайте,
// который не хостится на Netlify, это создаёт ВТОРОЙ, лишний вызов init()
// с неверным APIUrl — а виджет переиспользует общую переменную предыдущего
// рендера между вызовами init(), из-за чего второй (наш, с правильным
// APIUrl) рендер молча остаётся пустым. Отдавая патченную копию, мы сами
// вызываем init() ровно один раз, с нужным APIUrl — гонки не возникает.
const UPSTREAM_URL = "https://identity.netlify.com/v1/netlify-identity-widget.js";
const AUTO_INIT_TAIL =
  '"loading"===document.readyState?document.addEventListener("DOMContentLoaded",(function(){o.default.init()})):o.default.init()';

export async function GET() {
  const res = await fetch(UPSTREAM_URL, { next: { revalidate: 3600 } });
  const original = await res.text();

  // Если Netlify обновит бандл и этот фрагмент перестанет совпадать —
  // отдаём оригинал как есть, не ломая загрузку виджета вслепую.
  const patched = original.includes(AUTO_INIT_TAIL)
    ? original.replace(AUTO_INIT_TAIL, "void 0")
    : original;

  return new NextResponse(patched, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
