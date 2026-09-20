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
 * нужным id и стабилизации его позиции (две проверки подряд без сдвига),
 * и только потом скроллит — scrollIntoView сам уважает scroll-margin-top
 * (scroll-mt-* уже стоит на постах, см. skill egorpoet-poetry-blog,
 * раздел 11), отдельно ничего компенсировать не нужно.
 *
 * Поллинг — через setTimeout, НЕ requestAnimationFrame: rAF браузеры
 * приостанавливают почти полностью для неактивной/свёрнутой вкладки
 * (проверено на практике — при переключении пользователя на другую
 * вкладку сразу после клика цепочка rAF просто не доходила до конца, и
 * скролл не срабатывал вообще — хуже исходного бага). setTimeout в фоне
 * лишь троттлится до ~1с между тиками, но гарантированно срабатывает.
 */
export default function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const id = decodeURIComponent(hash.slice(1));
    let cancelled = false;
    let attemptsLeft = 60; // с шагом 50мс — 3с запаса на активной вкладке;
    // в фоновой вкладке из-за троттлинга setTimeout это может растянуться
    // дольше по часам, но не отменится — только так гарантируем итоговый
    // скролл, а не отказ от него.

    function waitForElement() {
      if (cancelled) return;
      const el = document.getElementById(id);
      if (!el) {
        if (attemptsLeft-- > 0) setTimeout(waitForElement, 50);
        return;
      }
      waitForStableLayout(el, el.getBoundingClientRect().top, 0);
    }

    function waitForStableLayout(el: HTMLElement, lastTop: number, stableChecks: number) {
      if (cancelled) return;
      setTimeout(() => {
        if (cancelled) return;
        const top = el.getBoundingClientRect().top;
        const settled = Math.abs(top - lastTop) < 1;
        // Две стабильные проверки подряд — не полагаемся на одно случайное
        // совпадение координат между сдвигами.
        if (settled && stableChecks >= 1) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
        if (attemptsLeft-- <= 0) {
          // Не дождались полной стабилизации — лучше проскроллить туда,
          // где элемент есть СЕЙЧАС, чем не проскроллить вообще.
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
        waitForStableLayout(el, top, settled ? stableChecks + 1 : 0);
      }, 50);
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
