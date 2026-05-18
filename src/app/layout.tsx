import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import JsonLd from "@/components/JsonLd";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], display: "swap", variable: "--font-outfit" });

export const metadata: Metadata = {
  metadataBase: new URL("https://kpsscografya.com.tr"),
  title: {
    default: "KPSS Coğrafya - Harita Destekli Eğitim Platformu",
    template: "%s | KPSS Coğrafya",
  },
  description:
    "Türkiye'nin en kapsamlı, harita destekli KPSS coğrafya hazırlık platformu. 81 ilin coğrafi özellikleri, madenler, tarım, iklim ve ulaşım konuları.",
  keywords: [
    "kpss coğrafya",
    "yks coğrafya",
    "tyt coğrafya",
    "ayt coğrafya",
    "kpss hazırlık",
    "yks hazırlık",
    "türkiye haritası",
    "kpss madenler",
    "kpss tarım",
    "kpss özet",
  ],
  authors: [{ name: "KPSS Coğrafya Ekibi" }],
  creator: "KPSS Coğrafya",
  publisher: "KPSS Coğrafya",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    languages: {
      "tr-TR": "https://kpsscografya.com.tr",
    },
  },
  openGraph: {
    title: "KPSS Coğrafya - Harita Destekli Eğitim Platformu",
    description: "Türkiye'nin en kapsamlı, harita destekli KPSS coğrafya hazırlık platformu.",
    url: "https://kpsscografya.com.tr",
    siteName: "KPSS Coğrafya",
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "KPSS Coğrafya - Harita Destekli Eğitim Platformu",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KPSS Coğrafya - Harita Destekli Eğitim Platformu",
    description: "Türkiye'nin en kapsamlı, harita destekli KPSS coğrafya hazırlık platformu.",
    images: ["/og-default.jpg"],
  },
  verification: {
    google: "edf2a85a89d149c4",
    yandex: "c4bcf9c545f31cd1",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://tile.openstreetmap.org" />
        <link rel="dns-prefetch" href="https://tile.openstreetmap.org" />
        <link rel="manifest" href="/manifest.json" />
        {/* Mobile & PWA Tags */}
        <meta name="theme-color" content="#1D4ED8" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="KPSS Coğrafya" />

        {/* GEO Tagging for Regional SEO */}
        <meta name="geo.region" content="TR" />
        <meta name="geo.position" content="38.963745;35.243322" />
        <meta name="ICBM" content="38.963745, 35.243322" />

        {/* Dublin Core Meta Tags */}
        <meta name="DC.title" content="KPSS Coğrafya Eğitim Platformu" />
        <meta name="DC.language" content="tr" />
        <meta name="DC.subject" content="KPSS Coğrafya, Türkiye Coğrafyası, Eğitim" />
        <meta name="DC.type" content="InteractiveResource" />
        <meta name="DC.format" content="text/html" />

        {/* Global Structured Data */}
        <JsonLd
          tip="WebSite"
          veri={{
            name: "KPSS Coğrafya",
            url: "https://kpsscografya.com.tr",
            description: "Türkiye'nin harita destekli KPSS Coğrafya hazırlık platformu",
            inLanguage: "tr-TR",
            datePublished: "2026-05-15T08:00:00+03:00",
            dateModified: "2026-05-17T22:00:00+03:00",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: "https://kpsscografya.com.tr/quiz?q={search_term_string}",
              },
              "query-input": "required name=search_term_string",
            },
          }}
        />
        <JsonLd
          tip="EducationalOrganization"
          veri={{
            name: "KPSS Coğrafya",
            url: "https://kpsscografya.com.tr",
            logo: "https://kpsscografya.com.tr/icon-512.png",
            sameAs: [],
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer support",
              availableLanguage: "Turkish",
            },
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-white text-surface-900 selection:bg-brand-100 selection:text-brand-700`}
      >
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
