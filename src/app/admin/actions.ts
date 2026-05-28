"use server";
import fs from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";

export async function deleteSoruAction(konuSlug: string, soruId: string) {
  try {
    const filePath = path.join(process.cwd(), "data/quiz", `${konuSlug}.json`);
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    // Sadece silinmeyenleri tut
    data.sorular = data.sorular.filter((q: any) => q.id !== soruId);

    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
    revalidatePath("/admin");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to delete question." };
  }
}
