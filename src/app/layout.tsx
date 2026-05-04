import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
// İleride eklenecek bileşenler (Navbar vb) için importlar
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ["latin"], display: 'swap', variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL('https://kpsscografya.com.tr'),
  title: {
    default: "KPSS Coğrafya - Harita Destekli Eğitim Platformu",
    template: "%s | KPSS Coğrafya"
  },
  description: "Türkiye'nin en kapsamlı, harita destekli KPSS coğrafya hazırlık platformu. 81 ilin coğrafi özellikleri, madenler, tarım, iklim ve ulaşım konuları.",
  keywords: ["kpss coğrafya", "kpss hazırlık", "türkiye haritası", "kpss madenler", "kpss tarım", "kpss özet"],
  authors: [{ name: "KPSS Coğrafya Ekibi" }],
  creator: "KPSS Coğrafya",
  publisher: "KPSS Coğrafya",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://kpsscografya.com.tr',
    languages: {
      'tr-TR': 'https://kpsscografya.com.tr',
    },
  },
  openGraph: {
    title: "KPSS Coğrafya - Harita Destekli Eğitim Platformu",
    description: "Türkiye'nin en kapsamlı, harita destekli KPSS coğrafya hazırlık platformu.",
    url: 'https://kpsscografya.com.tr',
    siteName: 'KPSS Coğrafya',
    locale: 'tr_TR',
    type: 'website',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'KPSS Coğrafya' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "KPSS Coğrafya - Harita Destekli Eğitim Platformu",
    description: "Türkiye'nin en kapsamlı, harita destekli KPSS coğrafya hazırlık platformu.",
    images: ['/og-default.jpg'],
  },
  verification: {
    google: 'googleedf2a85a89d149c4.html',
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
        {/* GEO Tagging for Regional SEO */}
        <meta name="geo.region" content="TR" />
        <meta name="geo.position" content="38.963745;35.243322" />
        <meta name="ICBM" content="38.963745, 35.243322" />
        <meta name="DC.title" content="KPSS Coğrafya Eğitim Platformu" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-gray-50 text-gray-900`}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Analytics />
        <SpeedInsights />
        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-SGTYB5MD7V" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-SGTYB5MD7V');
          `}
        </Script>
      </body>
    </html>
  );
}
