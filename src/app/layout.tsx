import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "El Numerador — Observatorio de Activos Globales",
  description:
    "Tracking de activos globales en tiempo real. Supply, stock-to-flow, dilución. Los activos tambi\u00e9n se diluyen. Unos m\u00e1s que otros.",
  keywords: [
    "activos globales",
    "supply",
    "stock-to-flow",
    "oro",
    "acciones",
    "bitcoin",
    "bonos",
    "inmuebles",
    "numerador",
    "macro",
  ],
  openGraph: {
    title: "El Numerador",
    description:
      "Cada precio es una fracci\u00f3n. Esto trackea el de arriba.",
    url: "https://elnumerador.com",
    siteName: "El Numerador",
    type: "website",
    locale: "es_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: "El Numerador",
    description:
      "Cada precio es una fracci\u00f3n. Esto trackea el de arriba.",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(!t)t=window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark';document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`,
          }}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="noise-overlay">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
