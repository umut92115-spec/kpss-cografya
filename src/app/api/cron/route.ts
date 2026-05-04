import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { generateKpssQuestion } from "@/lib/gemini";
import { sendTelegramPoll } from "@/lib/telegram";
import { Octokit } from "octokit";

export async function GET(req: NextRequest) {
  // 1. Auth Check (Vercel Cron Secret)
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // 2. Konu Seçimi (Rotation)
    const rotationPath = path.join(process.cwd(), "data/rotation.json");
    const rotation = JSON.parse(fs.readFileSync(rotationPath, "utf-8"));
    const topicSlug = rotation.topics[rotation.last_index];
    
    // Index güncelle
    rotation.last_index = (rotation.last_index + 1) % rotation.topics.length;
    
    // 3. Konu İçeriğini Oku
    const mdxPath = path.join(process.cwd(), `content/konu/${topicSlug}.mdx`);
    const content = fs.readFileSync(mdxPath, "utf-8");

    // 4. Görsel Eşleşmelerini Oku
    const imageMapPath = path.join(process.cwd(), "data/image-map.json");
    const imageMap = JSON.parse(fs.readFileSync(imageMapPath, "utf-8"));
    // Basit bir düzleştirme ile o konuya ait olabilecek görselleri alalım
    const availableImages = Object.values(imageMap).flatMap((v: any) => 
      typeof v === 'object' ? Object.values(v).flat() : v
    ) as string[];

    // 5. Gemini ile Soru Üret
    const questionData = await generateKpssQuestion(content, topicSlug, availableImages);

    // 6. Telegram'a Gönder
    await sendTelegramPoll({
      question: questionData.question,
      options: questionData.options,
      correct_index: questionData.correct_index,
      explanation: questionData.explanation,
      image: questionData.suggested_image !== "null" ? questionData.suggested_image : undefined
    });

    // 7. GitHub'a Kaydet (Octokit ile Commit)
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    const owner = process.env.GITHUB_OWNER!;
    const repo = process.env.GITHUB_REPO!;
    
    // Quiz Dosyasını Güncelle
    const quizPath = `data/quiz/${topicSlug}.json`;
    let currentQuizData = [];
    
    try {
      const { data: fileData } = await octokit.rest.repos.getContent({
        owner, repo, path: quizPath
      });
      if ('content' in fileData) {
        currentQuizData = JSON.parse(Buffer.from(fileData.content, 'base64').toString());
      }
    } catch (e) { /* Dosya yoksa boş dizi kalır */ }

    currentQuizData.push({
      ...questionData,
      created_at: new Date().toISOString()
    });

    // GitHub'a Commit Et
    await octokit.rest.repos.createOrUpdateFileContents({
      owner, repo,
      path: quizPath,
      message: `🤖 Bot: Yeni soru eklendi (${topicSlug})`,
      content: Buffer.from(JSON.stringify(currentQuizData, null, 2)).toString('base64'),
      sha: (await getFileSha(octokit, owner, repo, quizPath)) || undefined
    });

    // Rotation dosyasını da güncelle
    await octokit.rest.repos.createOrUpdateFileContents({
      owner, repo,
      path: "data/rotation.json",
      message: `🤖 Bot: Rotasyon güncellendi`,
      content: Buffer.from(JSON.stringify(rotation, null, 2)).toString('base64'),
      sha: await getFileSha(octokit, owner, repo, "data/rotation.json")
    });

    return NextResponse.json({ success: true, topic: topicSlug });

  } catch (error: any) {
    console.error("Cron Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

async function getFileSha(octokit: Octokit, owner: string, repo: string, path: string) {
  try {
    const { data } = await octokit.rest.repos.getContent({ owner, repo, path });
    if ('sha' in data) return data.sha;
  } catch (e) { return null; }
}
