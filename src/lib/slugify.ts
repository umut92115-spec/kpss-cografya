export function slugify(text: string): string {
  const charMap: Record<string, string> = {
    ğ: "g",
    Ğ: "g",
    ü: "u",
    Ü: "u",
    ş: "s",
    Ş: "s",
    ı: "i",
    İ: "i",
    ö: "o",
    Ö: "o",
    ç: "c",
    Ç: "c",
  };

  return text
    .split("")
    .map((char) => charMap[char] || char)
    .join("")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * MDX başlıkları için (h2, h3) güvenli ID oluşturur.
 */
export function slugifyHeading(children: React.ReactNode): string {
  const text = typeof children === "string" ? children : String(children);
  return slugify(text);
}
