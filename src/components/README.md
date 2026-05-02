# KpssCografya Bileşen ve Resim Kuralları

1. **Görseller (Images)**
   - Projede standart `<img>` HTML etiketi kullanmak KESİNLİKLE YASAKTIR.
   - Her görsel `next/image` bileşeni ile eklenmelidir.
   - Görseller statik genişlik (width) ve yükseklik (height) belirtilerek düzeni (CLS - Cumulative Layout Shift) bozmayacak şekilde eklenmelidir.
   - Ana ekran (above-the-fold) görselleri için `priority={true}` özelliği kullanılmalıdır.

2. **Image Alt Etiket (Alt Tag) Kuralı**
   - Alt tag her görselde zorunludur ve boş olamaz.
   - Format: `"[konu/il] + KPSS coğrafya + açıklayıcı ifade"`
   - Örnek: `alt="Ankara ili Türkiye haritasında konumu — KPSS coğrafya"`
   - Bu tagleri otomatikleştirmek için `lib/altText.ts` içindeki `getIlAltText` ve `getKonuAltText` fonksiyonlarını kullanabilirsiniz.
