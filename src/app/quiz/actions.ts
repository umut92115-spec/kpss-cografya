"use server";

export async function generateDenemeAction() {
  return {
    success: false,
    error:
      "Cloudflare Workers dosya boyutu limitleri sebebiyle Deneme Sınavı Oluştur özelliği geçici olarak devre dışıdır. (Verilerin client tarafına taşınması gerekmektedir)",
  };
}
