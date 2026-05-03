import { MetadataRoute } from 'next'
import { getAllIller, bolgeler } from '@/lib/getIlData'
import { getAllKonular } from '@/lib/getKonuData'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://kpsscografya.com.tr'
  
  const iller = getAllIller()
  const konular = getAllKonular()
 
  const ilUrls = iller.flatMap((il) => [
    {
      url: `${baseUrl}/${il.bolge_slug}bolgesi/il/${il.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    ...konular.map(konu => ({
      url: `${baseUrl}/${il.bolge_slug}bolgesi/il/${il.slug}/${konu.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }))
  ])

  const bolgeUrls = bolgeler.map((b) => ({
    url: `${baseUrl}/${b.url}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))
 
  const konuUrls = konular.map((konu) => ({
    url: `${baseUrl}/konu/${konu.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const haritaUrls = konular.map((konu) => ({
    url: `${baseUrl}/harita/${konu.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))
 
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...bolgeUrls,
    ...konuUrls,
    ...ilUrls,
    ...haritaUrls,
  ]
}
