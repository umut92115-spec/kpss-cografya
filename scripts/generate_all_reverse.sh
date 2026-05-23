#!/bin/bash

# Tüm konuların TERS sıradaki listesi
TOPICS=(
  "bolge-jeopolitik"
  "kalkinma-projeleri"
  "sinir-kapilari"
  "turizm"
  "ticaret"
  "ulasim"
  "sanayi"
  "madenler-enerji"
  "tarim"
  "beseri-cografya"
  "toprak-cevre"
  "iklim-bitki"
  "kiyi-tipleri"
  "jeolojik-yapi"
  "akarsular"
  "goller"
  "daglar"
  "yer-sekilleri"
  "cografi-konum"
)

# Her konu için 100 yeni soru üret (v2 scripti kullanılarak)
for topic in "${TOPICS[@]}"; do
  echo "============================================="
  echo "Ters Üretim Başlıyor: $topic"
  echo "============================================="
  npx -y tsx scripts/generate_questions_v2.ts --topic="$topic" --count=100
  echo "---------------------------------------------"
  echo "Ters Üretim Tamamlandı: $topic. 10 saniye bekleniyor..."
  sleep 10
done

echo "TERS YÖNLÜ TÜM KONULAR İÇİN ÜRETİM TAMAMLANDI!"
