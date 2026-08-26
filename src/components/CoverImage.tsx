"use client";

import { useEffect, useRef, useState } from "react";

export default function CoverImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // На статически сгенерированной странице <img> начинает грузиться ещё
  // до гидратации React — если файл уже отдал 404 к этому моменту,
  // событие error могло случиться раньше, чем повесился onError.
  // Поэтому дополнительно перепроверяем состояние сразу после монтирования.
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth === 0) {
      setBroken(true);
    }
  }, []);

  if (broken) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={className}
      onError={() => setBroken(true)}
    />
  );
}
