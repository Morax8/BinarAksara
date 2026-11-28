/** Profil aksesibilitas yang tersedia. */
export type ProfileId = "standar" | "disleksia" | "adhd" | "lowVision";

/** Preferensi tampilan dan pembacaan yang dipilih pengguna. */
export interface Preferences {
  activeProfile: ProfileId;
  fontFamily: string;
  fontScale: number;
  letterSpacing: number;
  lineHeight: number;
  wordSpacing: number;
  measure: string;
  rulerEnabled: boolean;
  bionicEnabled: boolean;
  syllabificationEnabled: boolean;
  ttsRate: number;
}

/** Satu kata dalam teks, beserta pembagian suku kata opsional. */
export interface Token {
  text: string;
  syllables: string[];
}

/** Kartu belajar yang memuat teks, token, dan kata kunci. */
export interface Card {
  id: string;
  index: number;
  text: string;
  sentences: string[];
  tokens: Token[];
  keywords: string[];
}

/** Hasil transformasi materi menjadi urutan kartu belajar. */
export interface Module {
  id: string;
  title: string;
  sourceText: string;
  cards: Card[];
  load: { before: LoadScore; after: LoadScore };
}

/** Butir latihan rumpang untuk satu kartu. */
export interface ClozeItem {
  id: string;
  cardId: string;
  prompt: string;
  answer: string;
  options: string[];
}

/** Materi contoh yang dapat dipilih pengguna. */
export interface SampleMaterial {
  id: string;
  title: string;
  subject: string;
  content: string;
}

/** Heuristik transparan untuk membandingkan kompleksitas teks, bukan diagnosis. */
export interface LoadScore {
  value: number;
  label: "rendah" | "sedang" | "tinggi";
  factors: {
    avgSentenceWords: number;
    longWordRatio: number;
    avgClausesPerSentence: number;
    cardCount: number;
  };
}

/** Status pemutaran text-to-speech. */
export type SpeechStatus = "idle" | "playing" | "paused" | "unavailable" | "error";
