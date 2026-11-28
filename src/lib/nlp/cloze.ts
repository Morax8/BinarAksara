import type { ClozeItem, Module } from "@/types";
import { STOPWORDS_ID } from "./stopwords-id";

const STOPWORDS = new Set(STOPWORDS_ID);
const TOKEN = /[^\s.,;:!?“”"'…]+/gu;

type LexicalClass = "alphabetic" | "numeric" | "notation";
interface Candidate {
  value: string;
  normalized: string;
  lexicalClass: LexicalClass;
}

function normalize(value: string): string {
  return value.toLocaleLowerCase("id-ID");
}

function lexicalClass(value: string): LexicalClass {
  if (/^\p{L}+$/u.test(value)) return "alphabetic";
  if (/^\p{N}+$/u.test(value)) return "numeric";
  return "notation";
}

function toCandidate(value: string): Candidate | null {
  const lettersAndNumbers = value.match(/[\p{L}\p{N}]/gu)?.length ?? 0;
  const normalized = normalize(value);
  if (lettersAndNumbers < 4 || STOPWORDS.has(normalized)) return null;
  return { value, normalized, lexicalClass: lexicalClass(value) };
}

function hashSeed(seed: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function createRandom(seed: string): () => number {
  let state = hashSeed(seed);
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled<T>(values: readonly T[], random: () => number): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

function compatible(candidate: Candidate, chosen: readonly Candidate[]): boolean {
  return chosen.every((other) =>
    candidate.lexicalClass === other.lexicalClass &&
    candidate.normalized !== other.normalized &&
    !candidate.normalized.includes(other.normalized) &&
    !other.normalized.includes(candidate.normalized)
  );
}

/** Latihan rumpang berbasis aturan; kartu tanpa empat opsi layak dilewati. */
export function createClozeItems(module: Module, seed = module.id): ClozeItem[] {
  const random = createRandom(seed);
  const poolByNormalized = new Map<string, Candidate>();
  for (const card of module.cards) {
    for (const keyword of card.keywords) {
      const candidate = toCandidate(keyword);
      if (candidate && !poolByNormalized.has(candidate.normalized)) {
        poolByNormalized.set(candidate.normalized, candidate);
      }
    }
  }
  const pool = [...poolByNormalized.values()];
  const items: ClozeItem[] = [];

  for (const card of module.cards) {
    const keywords = card.keywords.flatMap((keyword) => {
      const candidate = toCandidate(keyword);
      return candidate ? [candidate] : [];
    });
    const answers = shuffled(card.sentences.flatMap((sentence, sentenceIndex) =>
      [...sentence.matchAll(TOKEN)].flatMap((match) => {
        const normalized = normalize(match[0]);
        const candidate = keywords.find((keyword) => keyword.normalized === normalized);
        return candidate ? [{ candidate, sentence, sentenceIndex, index: match.index }] : [];
      })
    ), random);

    for (const answer of answers) {
      const prompt = `${answer.sentence.slice(0, answer.index)}_____${answer.sentence.slice(answer.index + answer.candidate.value.length)}`;
      const normalizedPrompt = normalize(prompt);
      if (normalizedPrompt.includes(answer.candidate.normalized)) continue;
      const distractors = shuffled(pool, random).filter((candidate) =>
        compatible(candidate, [answer.candidate]) && !normalizedPrompt.includes(candidate.normalized)
      );
      const options: Candidate[] = [answer.candidate];
      for (const candidate of distractors) {
        if (compatible(candidate, options)) options.push(candidate);
        if (options.length === 4) break;
      }
      if (options.length !== 4) continue;

      items.push({
        id: `cloze-${module.id}-${card.id}-${answer.sentenceIndex}-${answer.index}`,
        cardId: card.id,
        prompt,
        answer: answer.candidate.value,
        options: shuffled(options, random).map((option) => option.value),
      });
      break;
    }
  }
  return items;
}
