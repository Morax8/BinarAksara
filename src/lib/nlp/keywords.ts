import { STOPWORDS_ID } from "./stopwords-id";

const STOPWORDS = new Set(STOPWORDS_ID);

/**
 * Ekstraksi istilah berbasis TF, bukan pemahaman semantik atau pengenalan konsep.
 * Frekuensi dihitung case-insensitive; kapitalisasi kemunculan pertama dipertahankan.
 */
export function extractKeywords(text: string, limit = 8): string[] {
  if (!Number.isFinite(limit) || limit <= 0) return [];
  const words = text.toLocaleLowerCase("id-ID").match(/[\p{L}\p{N}]+/gu) ?? [];
  const frequencies = new Map<string, { count: number; display: string }>();

  for (const word of words) {
    if (word.length < 4 || /^\p{N}+$/u.test(word) || STOPWORDS.has(word)) continue;
    const entry = frequencies.get(word);
    if (entry) entry.count += 1;
    else {
      const first = text.match(new RegExp(`\\b${word}\\b`, "iu"))?.[0] ?? word;
      frequencies.set(word, { count: 1, display: first });
    }
  }

  return [...frequencies.entries()]
    .sort(([a, left], [b, right]) => right.count - left.count || a.localeCompare(b, "id-ID"))
    .slice(0, Math.floor(limit))
    .map(([, entry]) => entry.display);
}
