import type { Metadata } from "next";

const SITE_URL = "https://egor.an51.su";
const SITE_NAME = "Егор Андреев — стихи и песни";
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-default.jpg`;

export function buildMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const url = `${SITE_URL}${path}`;
  const ogImage = image ?? DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1024, height: 576 }],
      locale: "ru_RU",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export { SITE_URL, SITE_NAME };
