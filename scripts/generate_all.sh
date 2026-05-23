#!/bin/bash

# Tüm konuların listesi
TOPICS=(
  "cografi-konum"
  "yer-sekilleri"
  "daglar"
  "goller"
  "akarsular"
  "jeolojik-yapi"
  "kiyi-tipleri"
  "iklim-bitki"
  "toprak-cevre"
  "beseri-cografya"
  "tarim"
  "madenler-enerji"
  "sanayi"
  "ulasim"
  "ticaret"
  "turizm"
  "sinir-kapilari"
  "kalkinma-projeleri"
  "bolge-jeopolitik"
)

# Her konu için 100 yeni soru üret
for topic in "${TOPICS[@]}"; do
  echo "============================================="
  echo "Başlıyor: $topic"
  echo "============================================="
  npx -y tsx scripts/generate_questions.ts --topic="$topic" --count=100
  echo "---------------------------------------------"
  echo "Tamamlandı: $topic. 10 saniye bekleniyor..."
  sleep 10
done

echo "TÜM KONULAR İÇİN ÜRETİM TAMAMLANDI!"
