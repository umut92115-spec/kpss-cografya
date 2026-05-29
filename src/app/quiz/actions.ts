"use server";

export async function generateDenemeAction(): Promise<{
  success: boolean;
  error?: string;
  sorular?: any[];
}> {
  return {
    success: false,
    error:
      "Cloudflare Workers dosya boyutu limitleri sebebiyle Deneme Sınavı Oluştur özelliği geçici olarak devre dışıdır. (Verilerin client tarafına taşınması gerekmektedir)",
  };
}
