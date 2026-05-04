export async function sendTelegramPoll(pollData: {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
  image?: string;
}) {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  const BASE_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

  // Eğer görsel varsa önce onu gönder
  if (pollData.image) {
    const imageUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/images/konu/${pollData.image}`;
    await fetch(`${BASE_URL}/sendPhoto`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        photo: imageUrl,
        caption: "🧭 KPSS COĞRAFYA | Görsel Analiz"
      }),
    });
  }

  // Anketi (Quiz Mode) gönder
  const response = await fetch(`${BASE_URL}/sendPoll`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      question: pollData.question,
      options: pollData.options,
      is_anonymous: false,
      type: "quiz",
      correct_option_id: pollData.correct_index,
      explanation: pollData.explanation,
      explanation_parse_mode: "MarkdownV2"
    }),
  });

  return response.json();
}
