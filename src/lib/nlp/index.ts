export * from "./sentenceSplitter";
export * from "./cards";
export * from "./syllabifier";
export * from "./keywords";
export * from "./cloze";
export * from "./bionic";
export * from "./loadScore";
export * from "./stopwords-id";

import type { Card, LoadScore, Module } from "@/types";
import { chunkCards, tokenize } from "./cards";
import { extractKeywords } from "./keywords";
import { calculateLoadScore } from "./loadScore";
import { splitSentences } from "./sentenceSplitter";

/** Hash FNV-1a 32-bit: identitas stabil berdasarkan isi, tanpa waktu/random. */
function hashText(text: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function labelFor(value: number): LoadScore["label"] {
  return value < 40 ? "rendah" : value < 70 ? "sedang" : "tinggi";
}

export function buildModule(sourceText: string, title = "Materi Belajar"): Module | null {
  if (!sourceText.trim()) return null;
  const sentences = splitSentences(sourceText);
  const cards: Card[] = chunkCards(sentences).map((card) => ({
    ...card,
    id: `card-${card.index}`,
    tokens: tokenize(card.text),
    keywords: extractKeywords(card.text),
  }));
  const before = calculateLoadScore(sourceText);

  // "Sesudah" adalah skor PER SAJIAN KARTU: rata-rata value skor tiap kartu
  // berbobot jumlah kata; faktor dirata-rata dengan bobot yang sama, lalu label
  // mengikuti value akhir. Ini mengukur potongan sajian hasil chunking, bukan
  // efek medis/klinis. factors.cardCount tidak bermakna untuk ditampilkan pada
  // after karena nilainya selalu rata-rata jumlah kartu per kartu; UI hanya akan
  // menampilkan tiga faktor lainnya.
  const cardScores = cards.map((card) => ({
    score: calculateLoadScore(card.text),
    weight: tokenize(card.text).length,
  }));
  const totalWords = cardScores.reduce((sum, card) => sum + card.weight, 0) || 1;
  const weighted = (select: (score: LoadScore) => number) =>
    cardScores.reduce((sum, card) => sum + select(card.score) * card.weight, 0) / totalWords;
  const value = Math.round(weighted((score) => score.value));
  const after: LoadScore = {
    value,
    label: labelFor(value),
    factors: {
      avgSentenceWords: weighted((score) => score.factors.avgSentenceWords),
      longWordRatio: weighted((score) => score.factors.longWordRatio),
      avgClausesPerSentence: weighted((score) => score.factors.avgClausesPerSentence),
      cardCount: weighted((score) => score.factors.cardCount),
    },
  };

  return {
    id: `module-${hashText(sourceText)}`,
    title,
    sourceText,
    cards,
    load: { before, after },
  };
}
