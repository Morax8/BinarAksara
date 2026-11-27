import type { LoadScore } from "@/types";
import { chunkCards, CLAUSE_BOUNDARY, tokenize } from "./cards";
import { splitSentences } from "./sentenceSplitter";

const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value));

/**
 * Skor heuristik untuk perbandingan teks, bukan pengukuran psikologis/klinis.
 * Bobot: panjang kalimat 45 (normalisasi 25 kata), kata panjang 25 (rasio 35%),
 * klausa 20 (rata-rata 4 klausa), dan jumlah kartu 10 (normalisasi 12 kartu).
 * Panjang bacaan dan kerapatan informasi mendominasi; jumlah kartu sengaja kecil.
 */
export function calculateLoadScore(text: string): LoadScore {
  const sentences = splitSentences(text);
  const words = tokenize(text).map((token) => token.text);
  const cards = chunkCards(sentences);
  const sentenceCount = sentences.length;
  const totalClauses = sentences.reduce(
    (sum, sentence) => sum + 1 + (sentence.match(CLAUSE_BOUNDARY)?.length ?? 0),
    0,
  );
  const avgSentenceWords = sentenceCount ? words.length / sentenceCount : 0;
  const longWordRatio = words.length
    ? words.filter((word) => (word.match(/\p{L}/gu)?.length ?? 0) >= 10).length / words.length
    : 0;
  const avgClausesPerSentence = sentenceCount ? totalClauses / sentenceCount : 0;
  const cardCount = cards.length;
  const value = Math.round(
    45 * clamp(avgSentenceWords / 25) +
      25 * clamp(longWordRatio / 0.35) +
      20 * clamp(avgClausesPerSentence / 4) +
      10 * clamp(cardCount / 12),
  );

  return {
    value: Math.min(100, Math.max(0, value)),
    label: value < 40 ? "rendah" : value < 70 ? "sedang" : "tinggi",
    factors: { avgSentenceWords, longWordRatio, avgClausesPerSentence, cardCount },
  };
}
