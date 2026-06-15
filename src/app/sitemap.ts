import { MetadataRoute } from "next";
import { getAllIller, bolgeler } from "@/lib/getIlData";
import { getAllKonular } from "@/lib/getKonuData";
import { fetchPublicData } from "@/lib/fetchData";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://kpsscografya.com.tr";
  const updateDate = new Date("2026-05-17");

  const iller = await getAllIller();
  const konular = await getAllKonular();

  const ilUrls = iller.flatMap((il) => [
    {
      url: `${baseUrl}/${il.bolge_slug}bolgesi/il/${il.slug}`,
      lastModified: updateDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    ...konular
      .filter((k) => k.slug !== "sozluk")
      .map((konu) => ({
        url: `${baseUrl}/${il.bolge_slug}bolgesi/il/${il.slug}/${konu.slug}`,
        lastModified: updateDate,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
  ]);

  const bolgeUrls = bolgeler.map((b) => ({
    url: `${baseUrl}/${b.url}`,
    lastModified: updateDate,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const konuUrls = konular.map((konu) => ({
    url: `${baseUrl}/konu/${konu.slug}`,
    lastModified: updateDate,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const haritaUrls = konular.map((konu) => ({
    url: `${baseUrl}/harita/${konu.slug}`,
    lastModified: updateDate,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const hazirlikUrls = [
    {
      url: `${baseUrl}/hazirlik`,
      lastModified: updateDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/hazirlik/lisans`,
      lastModified: updateDate,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/hazirlik/onlisans`,
      lastModified: updateDate,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/hazirlik/ortaogretim`,
      lastModified: updateDate,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
  ];

  const makaleUrls = [
    {
      url: `${baseUrl}/makale/kpss-lisans-cografya-konulari-2026`,
      lastModified: updateDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/makale/kpss-onlisans-cografya-konulari-2026`,
      lastModified: updateDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/makale/kpss-ortaogretim-cografya-konulari-2026`,
      lastModified: updateDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];

  // Ana liste sayfaları
  const staticGroupUrls = [
    {
      url: `${baseUrl}/quiz`,
      lastModified: updateDate,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/il`,
      lastModified: updateDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/konu`,
      lastModified: updateDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/harita`,
      lastModified: updateDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/hakkinda`,
      lastModified: updateDate,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/iletisim`,
      lastModified: updateDate,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];

  // Quiz sayfaları — konular listesinden üret (fs kullanmadan)
  const quizUrls: MetadataRoute.Sitemap = konular.map((konu) => ({
    url: `${baseUrl}/quiz/${konu.slug}`,
    lastModified: updateDate,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Ek quiz JSON'ları varsa kontrol et (opsiyonel, fetch ile)
  interface QuizIndex {
    slugs?: string[];
  }
  const quizIndex = await fetchPublicData<QuizIndex>("data/quiz-index.json").catch(() => null);
  const extraQuizUrls: MetadataRoute.Sitemap = (quizIndex?.slugs || [])
    .filter((slug) => !konular.find((k) => k.slug === slug))
    .map((slug) => ({
      url: `${baseUrl}/quiz/${slug}`,
      lastModified: updateDate,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  return [
    {
      url: baseUrl,
      lastModified: updateDate,
      changeFrequency: "daily",
      priority: 1,
    },
    ...staticGroupUrls,
    ...bolgeUrls,
    ...konuUrls,
    ...ilUrls,
    ...haritaUrls,
    ...hazirlikUrls,
    ...makaleUrls,
    ...quizUrls,
    ...extraQuizUrls,
  ];
}
