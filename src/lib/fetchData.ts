/**
 * Cloudflare Pages uyumlu veri okuma yardımcısı.
 * node:fs yerine fetch() kullanır — Cloudflare Workers'ta fs desteklenmez.
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === "production" ? "https://kpsscografya.com.tr" : "http://localhost:3000");

/**
 * public/ klasöründeki bir JSON dosyasını fetch() ile okur.
 * @param path - public/ klasörüne göre yol, örn: "data/konular.json"
 */
export async function fetchPublicData<T>(path: string): Promise<T | null> {
  try {
    const url = `${BASE_URL}/${path}`;
    const res = await fetch(url, {
      // Build zamanında önbelleğe alınır, runtime'da kullanılır
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.error(`fetchPublicData: HTTP ${res.status} — ${url}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error(`fetchPublicData: hata — ${path}`, err);
    return null;
  }
}

/**
 * public/ klasöründeki bir text dosyasını fetch() ile okur (MDX vb.)
 * @param path - public/ klasörüne göre yol, örn: "content/konu/akarsular.mdx"
 */
export async function fetchPublicText(path: string): Promise<string | null> {
  try {
    const url = `${BASE_URL}/${path}`;
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.error(`fetchPublicText: HTTP ${res.status} — ${url}`);
      return null;
    }
    return await res.text();
  } catch (err) {
    console.error(`fetchPublicText: hata — ${path}`, err);
    return null;
  }
}
