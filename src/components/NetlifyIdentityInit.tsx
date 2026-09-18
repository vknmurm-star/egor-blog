"use client";

import Script from "next/script";

declare global {
  interface Window {
    netlifyIdentity?: {
      init: (opts: { APIUrl: string }) => void;
      on: (event: string, cb: (user: unknown) => void) => void;
    };
  }
}

const NETLIFY_IDENTITY_API_URL =
  "https://velvety-florentine-f1a5e2.netlify.app/.netlify/identity";

export default function NetlifyIdentityInit() {
  return (
    <Script
      src="/api/netlify-identity-widget"
      strategy="afterInteractive"
      onLoad={() => {
        window.netlifyIdentity?.init({ APIUrl: NETLIFY_IDENTITY_API_URL });
        window.netlifyIdentity?.on("init", (user) => {
          if (!user) {
            window.netlifyIdentity?.on("login", () => {
              document.location.href = "/admin/";
            });
          }
        });
      }}
    />
  );
}
