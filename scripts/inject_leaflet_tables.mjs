import fs from 'fs';
import path from 'path';

const dataDir = './data/leaflet';
const contentDir = './content/konu';

const mappings = [
  {
    jsonFile: 'daglar.json',
    mdxFile: 'daglar.mdx',
    title: 'Haritada Önemli Dağlar ve Zirveler',
    description: 'Aşağıdaki tabloda, haritada interaktif olarak inceleyebileceğiniz Türkiye\'nin en önemli dağ ve zirvelerinin listesi, bulundukları sıradağlar ve KPSS sınavında çıkabilecek özenle hazırlanmış özet notları yer almaktadır.',
    columns: ['Dağ Adı', 'Yükseklik (m)', 'Sıra Dağ / Bölge', 'Açıklama / KPSS Sınav Notu'],
    rowFn: (item) => [
      `**${item.isim}**`,
      item.yukseklik_m ? `${item.yukseklik_m} m` : '-',
      item.sira_dag || '-',
      item.notlar || '-'
    ]
  },
  {
    jsonFile: 'akarsular.json',
    mdxFile: 'akarsular.mdx',
    title: 'Haritada Önemli Akarsular ve Nehirler',
    description: 'Aşağıdaki tabloda, haritamızda yer alan Türkiye\'nin en önemli akarsularının kaynağı, döküldüğü havza, uzunluğu ve geçtiği önemli iller listelenmiştir.',
    columns: ['Akarsu Adı', 'Uzunluk (km)', 'Döküldüğü Yer / Havza', 'Geçtiği Önemli İller'],
    deduplicateKey: 'isim',
    rowFn: (item) => [
      `**${item.isim}**`,
      item.uzunluk_km ? `${item.uzunluk_km} km` : '-',
      item.dokulduğu_yer || item.dokuldugu_yer || '-',
      Array.isArray(item.gectiği_iller || item.gectigi_iller) 
        ? (item.gectiği_iller || item.gectigi_iller).join(', ') 
        : '-'
    ]
  },
  {
    jsonFile: 'goller.json',
    mdxFile: 'goller.mdx',
    title: 'Haritada Önemli Göller ve Barajlar',
    description: 'Aşağıdaki tabloda, haritamızda interaktif olarak gösterilen göllerin yüzölçümü, oluşum tipleri (tektonik, karstik, volkanik vb.), su kimyası (tatlı, tuzlu, acı) ve KPSS\'de çıkabilecek sınav bilgileri yer almaktadır.',
    columns: ['Göl / Baraj Adı', 'Bulunduğu İl(ler)', 'Oluşum Türü', 'Su Türü', 'Yüzölçümü (km²)', 'Açıklama / KPSS Notu'],
    rowFn: (item) => [
      `**${item.isim}**`,
      item.il || '-',
      item.olusum_tipi ? item.olusum_tipi.charAt(0).toUpperCase() + item.olusum_tipi.slice(1) : '-',
      item.su_tipi ? item.su_tipi.charAt(0).toUpperCase() + item.su_tipi.slice(1) : '-',
      item.yuzolcumu_km2 ? `${item.yuzolcumu_km2} km²` : '-',
      item.notlar || '-'
    ]
  },
  {
    jsonFile: 'ovalar.json',
    mdxFile: 'yer-sekilleri.mdx',
    title: 'Haritada Önemli Ovalarımız',
    description: 'Aşağıdaki tabloda, Türkiye\'deki başlıca ovaların oluşum mekanizmaları (delta, tektonik, karstik vb.), bulundukları iller, sulanmasını sağlayan akarsular ve tarımsal/ekonomik önemleri yer almaktadır.',
    columns: ['Ova Adı', 'Bulunduğu İl(ler)', 'Oluşum Tipi', 'Bağlı Akarsu', 'Alan (km²)', 'Ekonomik Önemi ve KPSS Bilgisi'],
    rowFn: (item) => [
      `**${item.isim}**`,
      item.il || '-',
      item.olusum_tipi ? item.olusum_tipi.charAt(0).toUpperCase() + item.olusum_tipi.slice(1) : '-',
      item.bagli_akarsu || '-',
      item.alan_km2 ? `${item.alan_km2} km²` : '-',
      item.ekonomik_onemi || '-'
    ]
  },
  {
    jsonFile: 'kiyi_olusumlar.json',
    mdxFile: 'kiyi-tipleri.mdx',
    title: 'Haritada Önemli Kıyı Oluşumları, Körfezler ve Boğazlar',
    description: 'Aşağıdaki tabloda, Türkiye kıyılarında yer alan ve KPSS coğrafya sınavında sıklıkla soru olarak karşımıza çıkan önemli boğazlar, körfezler, yarımadalar ve kıyı tipleri özetlenmiştir.',
    columns: ['Kıyı Oluşumu / Noktası', 'Türü', 'Bağlantılı Deniz', 'Kıyı Yapısı / Tipi', 'Açıklama / KPSS Önemi'],
    rowFn: (item) => [
      `**${item.isim}**`,
      item.tip ? item.tip.toUpperCase() : '-',
      item.deniz || '-',
      item.kiyi_tipi ? item.kiyi_tipi.toUpperCase() : '-',
      item.notlar || '-'
    ]
  },
  {
    jsonFile: 'madenler.json',
    mdxFile: 'madenler-enerji.mdx',
    title: 'Haritada Önemli Maden Yatakları ve Rezervleri',
    description: 'Aşağıdaki tabloda, Türkiye\'nin yeraltı zenginlikleri kapsamında haritamızda gösterilen bor, linyit, taşkömürü vb. maden yataklarının bulunduğu il, dünya sıralamasındaki yeri ve stratejik önemi listelenmiştir.',
    columns: ['Maden / Yatak Adı', 'Maden Türü', 'Bulunduğu İl', 'Dünya / Rezerv Durumu', 'KPSS Sınav Notu'],
    rowFn: (item) => [
      `**${item.isim}**`,
      item.maden_turu ? item.maden_turu.toUpperCase() : '-',
      item.il || '-',
      item.dunya_siralamasi || 'Önemli Rezerv',
      item.notlar || '-'
    ]
  },
  {
    jsonFile: 'limanlar.json',
    mdxFile: 'ulasim.mdx',
    title: 'Haritada Önemli Limanlarımız',
    description: 'Aşağıdaki tabloda, Türkiye\'nin dış ticaret ve ulaşımında kritik role sahip olan ve haritamızda interaktif olarak sergilenen başlıca ithalat/ihracat limanları, kapasiteleri ve KPSS sınav notları yer almaktadır.',
    columns: ['Liman Adı', 'Bulunduğu İl', 'Deniz', 'Liman Tipi', 'Yıllık Kapasite', 'Açıklama / KPSS Notu'],
    rowFn: (item) => [
      `**${item.isim}**`,
      item.il || '-',
      item.deniz || '-',
      item.liman_tipi ? item.liman_tipi.toUpperCase() : '-',
      item.yillik_kapasite || '-',
      item.notlar || '-'
    ]
  },
  {
    jsonFile: 'sinir_kapilari.json',
    mdxFile: 'sinir-kapilari.mdx',
    title: 'Haritada Aktif ve Pasif Sınır Kapılarımız',
    description: 'Aşağıdaki tabloda, Türkiye\'nin komşu ülkelere açılan kara ve demiryolu sınır kapıları, bulundukları iller, aktif/pasif durumları ve sınavda çıkabilecek jeopolitik öneme sahip notları listelenmiştir.',
    columns: ['Sınır Kapısı', 'Bağlantılı Ülke', 'Bulunduğu İl', 'Geçiş Türü', 'Durumu', 'Açıklama / KPSS Sınav Notu'],
    rowFn: (item) => [
      `**${item.isim}**`,
      item.ulke || '-',
      item.il || '-',
      item.kapi_tipi ? item.kapi_tipi.toUpperCase() : '-',
      item.aktif ? 'Aktif ✅' : 'Kapalı ❌',
      item.notlar || '-'
    ]
  },
  {
    jsonFile: 'turizm.json',
    mdxFile: 'turizm.mdx',
    title: 'Haritada Önemli KPSS Turizm Noktaları',
    description: 'Aşağıdaki tabloda, Türkiye\'nin turizm coğrafyası ders konularında yer alan ve haritamızda gösterilen UNESCO dünya miras alanları, antik kentler, inanç merkezleri ve doğal güzelliklerin detayları yer almaktadır.',
    columns: ['Destinasyon Adı', 'Bulunduğu İl', 'Turizm Türü', 'UNESCO Mirası mı?', 'Açıklama / KPSS Önemi'],
    rowFn: (item) => [
      `**${item.isim}**`,
      item.il || '-',
      item.turizm_tipi ? item.turizm_tipi.toUpperCase() : '-',
      item.unesco ? 'Evet 🏛️ (UNESCO)' : 'Hayır',
      item.notlar || '-'
    ]
  }
];

mappings.forEach(({ jsonFile, mdxFile, title, description, columns, deduplicateKey, rowFn }) => {
  const jsonPath = path.join(dataDir, jsonFile);
  const mdxPath = path.join(contentDir, mdxFile);

  if (!fs.existsSync(jsonPath)) {
    console.warn(`! JSON dosyası bulunamadı: ${jsonFile}`);
    return;
  }
  if (!fs.existsSync(mdxPath)) {
    console.warn(`! MDX dosyası bulunamadı: ${mdxFile}`);
    return;
  }

  try {
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    let points = data.noktalar || [];

    if (deduplicateKey) {
      const seen = new Set();
      points = points.filter(item => {
        const val = item[deduplicateKey];
        if (seen.has(val)) return false;
        seen.add(val);
        return true;
      });
    }

    // Markdown Tablo Oluşturma
    let tableMd = `\n---\n\n## ${title}\n\n${description}\n\n`;
    tableMd += `| ${columns.join(' | ')} |\n`;
    tableMd += `| ${columns.map(() => ':---').join(' | ')} |\n`;

    points.forEach(item => {
      const row = rowFn(item);
      // Clean pipeline chars in values to not break markdown tables
      const cleanRow = row.map(val => String(val).replace(/\|/g, '\\|'));
      tableMd += `| ${cleanRow.join(' | ')} |\n`;
    });

    tableMd += `\n`;

    // MDX Dosyasını Oku ve Güncelle
    let mdxContent = fs.readFileSync(mdxPath, 'utf8');

    // Eski eklenen tablo varsa onu temizle ( idempotent çalışması için )
    const existingSectionRegex = new RegExp(`\\n---\\n\\n## ${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?\\n---\\n`, 'g');
    mdxContent = mdxContent.replace(existingSectionRegex, '\n');

    // KPSS Soru Odakları başlığının hemen öncesine yerleştir
    const match = mdxContent.match(/(^##\s+(?:\d+\.\s+)?KPSS Soru Odakları.*)/m);
    if (match) {
      const insertIndex = mdxContent.indexOf(match[0]);
      const before = mdxContent.slice(0, insertIndex);
      const after = mdxContent.slice(insertIndex);
      mdxContent = `${before}${tableMd}---\n\n${after}`;
      fs.writeFileSync(mdxPath, mdxContent, 'utf8');
      console.log(`✓ '${mdxFile}' başarıyla güncellendi: ${points.length} satırlık tablo eklendi.`);
    } else {
      // Eğer KPSS Soru Odakları bulunamazsa en sona ekle
      mdxContent = `${mdxContent.trim()}\n\n${tableMd}---\n`;
      fs.writeFileSync(mdxPath, mdxContent, 'utf8');
      console.log(`✓ '${mdxFile}' sonuna tablo eklendi: ${points.length} satırlık tablo eklendi.`);
    }

  } catch (error) {
    console.error(`✗ '${mdxFile}' dosyasına tablo eklenirken hata:`, error);
  }
});
