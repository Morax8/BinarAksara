/** Profil aksesibilitas yang tersedia. */
export type ProfileId = "standar" | "disleksia" | "adhd" | "lowVision";

/** Preferensi tampilan dan pembacaan yang dipilih pengguna. */
export interface Preferences {
  activeProfile: ProfileId;
  fontFamily: string;
  fontScale: number;
  letterSpacing: number;
  lineHeight: number;
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

/** Kartu belajar yang memuat token dan kata kunci. */
export interface Card {
  id: string;
  tokens: Token[];
  keywords: string[];
}

/** Hasil transformasi materi menjadi urutan kartu belajar. */
export interface Module {
  id: string;
  title: string;
  sourceText: string;
  cards: Card[];
}

/** Butir latihan rumpang untuk satu kartu. */
export interface ClozeItem {
  id: string;
  prompt: string;
  answer: string;
}

/** Materi contoh yang dapat dipilih pengguna. */
export interface SampleMaterial {
  id: string;
  title: string;
  subject: string;
  content: string;
}

/** Ringkasan estimasi beban kognitif sebuah teks. */
export interface LoadScore {
  value: number;
  label: "rendah" | "sedang" | "tinggi";
}

/** Status pemutaran text-to-speech. */
export type SpeechStatus = "idle" | "playing" | "paused" | "unavailable";
