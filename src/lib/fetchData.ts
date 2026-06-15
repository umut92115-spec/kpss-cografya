/**
 * Veri okuma yardımcısı.
 * Build aşamasında fs kullanır (böylece generateStaticParams vb. sorunsuz çalışır).
 * Runtime'da Edge ortamında çalışırsa fetch kullanır.
 */
import fs from "fs";
import path from "path";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === "production" ? "https://kpsscografya.com.tr" : "http://localhost:3000");

export async function fetchPublicData<T>(relativePath: string): Promise<T | null> {
  // Build zamanında veya Node.js ortamında (NEXT_RUNTIME !== "edge")
  if (typeof process !== "undefined" && process.env.NEXT_RUNTIME !== "edge") {
    try {
      const filePath = path.join(process.cwd(), "public", relativePath);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(fileContent) as T;
    } catch (err) {
      console.error(`fetchPublicData: Local fs read error — ${relativePath}`, err);
      return null;
    }
  }

  // Edge / Runtime ortamı
  try {
    const url = `${BASE_URL}/${relativePath}`;
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.error(`fetchPublicData: HTTP ${res.status} — ${url}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error(`fetchPublicData: fetch hata — ${relativePath}`, err);
    return null;
  }
}

export async function fetchPublicText(relativePath: string): Promise<string | null> {
  if (typeof process !== "undefined" && process.env.NEXT_RUNTIME !== "edge") {
    try {
      const filePath = path.join(process.cwd(), "public", relativePath);
      return fs.readFileSync(filePath, "utf-8");
    } catch (err) {
      console.error(`fetchPublicText: Local fs read error — ${relativePath}`, err);
      return null;
    }
  }

  try {
    const url = `${BASE_URL}/${relativePath}`;
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.error(`fetchPublicText: HTTP ${res.status} — ${url}`);
      return null;
    }
    return await res.text();
  } catch (err) {
    console.error(`fetchPublicText: fetch hata — ${relativePath}`, err);
    return null;
  }
}
