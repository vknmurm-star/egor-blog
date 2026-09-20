"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Next.js App Router при клиентской навигации на URL с хэшем (наши ссылки
 * пагинации "Назад"/"Далее"/номера страниц, "Все публикации" со страницы
 * поста) пытается сам проскроллить к элементу — но делает это один раз,
 * не дожидаясь, пока лента постов реально осядет в финальный layout
 * (framer-motion whileInView-анимации, изображения обложек, гидратация).
 * Итог — прыжок в пустое место чуть выше/ниже нужного поста.
 *
 * Здесь скролл берём под свой контроль полностью: Link у соответствующих
 * ссылок помечен `scroll={false}` (Next ничего не делает сам), а этот
 * компонент на каждой смене маршрута сам дожидается появления элемента с
 * нужным id и стабилизации его позиции (два кадра подряд без сдвига), и
 * только потом скроллит — scrollIntoView сам уважает scroll-margin-top
 * (scroll-mt-* уже стоит на постах, см. skill egorpoet-poetry-blog,
 * раздел 11), отдельно ничего компенсировать не нужно.
 */
export default function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const id = decodeURIComponent(hash.slice(1));
    let cancelled = false;
    let framesLeft = 90; // ~1.5с при 60fps — щедрый запас на медленную загрузку

    function waitForElement() {
      if (cancelled) return;
      const el = document.getElementById(id);
      if (!el) {
        if (framesLeft-- > 0) requestAnimationFrame(waitForElement);
        return;
      }
      waitForStableLayout(el, el.getBoundingClientRect().top, 0);
    }

    function waitForStableLayout(el: HTMLElement, lastTop: number, stableFrames: number) {
      if (cancelled) return;
      requestAnimationFrame(() => {
        if (cancelled) return;
        const top = el.getBoundingClientRect().top;
        const settled = Math.abs(top - lastTop) < 1;
        // Две стабильные проверки подряд — не полагаемся на один кадр
        // случайного совпадения координат между сдвигами.
        if (settled && stableFrames >= 1) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
        if (framesLeft-- <= 0) {
          // Не дождались полной стабилизации — лучше проскроллить туда,
          // где элемент есть СЕЙЧАС, чем не проскроллить вообще.
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
        waitForStableLayout(el, top, settled ? stableFrames + 1 : 0);
      });
    }

    waitForElement();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- реагируем именно
    // на смену маршрута; hash на этот момент уже в window.location
  }, [pathname]);

  return null;
}
