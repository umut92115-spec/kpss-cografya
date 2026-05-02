export interface QuizSoru {
  id: string;
  soru: string;
  siklar: string[];
  dogru: string;
  aciklama: string;
  harita_il: string | null;
  zorluk: 'kolay' | 'orta' | 'zor';
}

export interface QuizData {
  konu: string;
  sorular: QuizSoru[];
}

export interface QuizSonuc {
  konuSlug: string;
  tarih: string;          // ISO string
  toplamSoru: number;
  dogruSayisi: number;
  sureMs: number;
  skor: number;           // 0-100
}
