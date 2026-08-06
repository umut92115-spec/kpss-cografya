// Client/static compatible stub action

export async function deleteSoruAction(konuSlug: string, soruId: string) {
  // Cloudflare Workers ortamında dosya yazma yetkisi olmadığı için bu işlem devre dışı bırakılmıştır.
  console.log("Delete attempt in production for:", konuSlug, soruId);
  return { success: false, error: "Production ortamında (Cloudflare) dosya düzenleme kapalıdır." };
}
