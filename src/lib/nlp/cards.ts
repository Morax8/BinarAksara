import type { Card, Token } from "@/types";

export const CLAUSE_BOUNDARY = /;|,\s*(?:tetapi|namun|sehingga|sedangkan|kemudian)\b/gi;
const MAX_CARD_LENGTH = 420;
const LONG_SENTENCE_LENGTH = 180;
const MIN_FRAGMENT_LENGTH = 30;

export function tokenize(text: string): Token[] {
  return text.trim().split(/\s+/).filter(Boolean).map((text) => ({
    text,
    syllables: [],
  }));
}

function splitLongSentence(sentence: string): string[] {
  if (sentence.length <= LONG_SENTENCE_LENGTH) return [sentence];

  const candidates = [...sentence.matchAll(CLAUSE_BOUNDARY)].map((match) => ({
    // Koma tetap di fragmen sebelumnya; konjungsi dan spasi menjadi awal fragmen berikutnya.
    end: match.index + (match[0].startsWith(",") ? 1 : match[0].length),
  }));
  const fragments: string[] = [];
  let start = 0;

  while (start < sentence.length) {
    const candidate = candidates.find(
      ({ end }) => end > start && end - start >= MIN_FRAGMENT_LENGTH &&
        (sentence.length - end === 0 || sentence.length - end >= MIN_FRAGMENT_LENGTH),
    );
    if (!candidate) break;
    fragments.push(sentence.slice(start, candidate.end));
    start = candidate.end;
  }
  const tail = sentence.slice(start);
  if (tail) fragments.push(tail);
  return fragments.length > 1 ? fragments : [sentence];
}

export type CardData = Omit<Card, "id" | "tokens" | "keywords">;

export function chunkCards(sentences: readonly string[]): CardData[] {
  const units = sentences.flatMap((sentence) => {
    const fragments = splitLongSentence(sentence.trim()).map((fragment) => fragment.trim());
    return fragments.map((text) => ({ text, standalone: fragments.length > 1 }));
  });
  const cards: CardData[] = [];
  let current: string[] = [];

  const flush = () => {
    if (!current.length) return;
    cards.push({
      index: cards.length,
      text: current.join(" "),
      sentences: [...current],
    });
    current = [];
  };

  for (const unit of units) {
    if (!unit.text) continue;
    const length = current.join(" ").length + (current.length ? 1 : 0) + unit.text.length;
    if (current.length && (unit.standalone || current.length >= 3 || length > MAX_CARD_LENGTH)) flush();
    current.push(unit.text);
    if (unit.standalone) flush();
  }
  flush();
  return cards;
}
