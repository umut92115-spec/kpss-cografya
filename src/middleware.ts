import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// Not: Büyük veri dosyalarını middleware'de import etmek performansı etkileyebilir 
// ancak 81 illik bu veri oldukça küçüktür.
import iller from '../data/iller.json';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Sadece /il/ ile başlayan ve /il/page gibi statik olmayan rotaları yakala
  if (pathname.startsWith('/il/') && pathname !== '/il') {
    const parts = pathname.split('/').filter(Boolean);
    const slug = parts[1];
    const subPath = parts.slice(2).join('/');

    // İlgili ili bul
    const il = (iller as unknown as { slug: string; bolge_slug: string }[]).find(i => i.slug === slug);

    if (il) {
      const bolgeSlug = `${il.bolge_slug}bolgesi`;
      const newPath = `/${bolgeSlug}/il/${slug}${subPath ? `/${subPath}` : ''}`;
      
      const url = request.nextUrl.clone();
      url.pathname = newPath;
      
      return NextResponse.redirect(url, 301);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/il/:path*'],
};
