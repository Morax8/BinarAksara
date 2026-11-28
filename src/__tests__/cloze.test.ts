import { describe, expect, it } from "vitest";
import { createClozeItems } from "@/lib/nlp/cloze";
import { buildModule } from "@/lib/nlp";
import { STOPWORDS_ID } from "@/lib/nlp/stopwords-id";
import { SAMPLES } from "@/data/samples";
import type { Module } from "@/types";

const STOPWORDS = new Set(STOPWORDS_ID);

function lexicalClass(value: string): string {
  if (/^\p{N}+$/u.test(value)) return "numeric";
  if (/^\p{L}+$/u.test(value)) return "alphabetic";
  return "notation";
}

function expectValidItems(learningModule: Module, seed = "uji") {
  const items = createClozeItems(learningModule, seed);
  expect(new Set(items.map((item) => item.id)).size).toBe(items.length);

  const keywordPool = new Set(learningModule.cards.flatMap((card) =>
    card.keywords.map((keyword) => keyword.toLocaleLowerCase("id-ID"))
  ));

  for (const item of items) {
    const card = learningModule.cards.find((candidate) => candidate.id === item.cardId)!;
    const cardKeywords = card.keywords.map((keyword) => keyword.toLocaleLowerCase("id-ID"));
    expect(cardKeywords).toContain(item.answer.toLocaleLowerCase("id-ID"));
    expect(card.sentences.some((source) => source.includes(item.answer))).toBe(true);
    const sentence = card.sentences.find((source) =>
      source.toLocaleLowerCase("id-ID").replace(item.answer.toLocaleLowerCase("id-ID"), "_____") === item.prompt.toLocaleLowerCase("id-ID")
    );
    expect(sentence).toBeDefined();
    expect(item.answer.length).toBeGreaterThanOrEqual(4);
    expect(STOPWORDS.has(item.answer.toLocaleLowerCase("id-ID"))).toBe(false);
    expect(item.prompt.toLocaleLowerCase("id-ID")).toBe(sentence!.toLocaleLowerCase("id-ID").replace(item.answer.toLocaleLowerCase("id-ID"), "_____"));
    expect(item.prompt.match(/_____/g)).toHaveLength(1);
    expect(item.prompt.toLocaleLowerCase("id-ID")).not.toContain(item.answer.toLocaleLowerCase("id-ID"));
    expect(item.options).toHaveLength(4);
    expect(item.options.filter((option) => option.toLocaleLowerCase("id-ID") === item.answer.toLocaleLowerCase("id-ID"))).toHaveLength(1);
    expect(new Set(item.options.map((option) => option.toLocaleLowerCase("id-ID"))).size).toBe(4);

    for (const option of item.options) {
      expect(keywordPool.has(option.toLocaleLowerCase("id-ID"))).toBe(true);
      expect(lexicalClass(option)).toBe(lexicalClass(item.answer));
      expect(STOPWORDS.has(option.toLocaleLowerCase("id-ID"))).toBe(false);
      for (const other of item.options) {
        if (option === other) continue;
        expect(option.toLocaleLowerCase("id-ID")).not.toContain(other.toLocaleLowerCase("id-ID"));
      }
    }
    for (const distractor of item.options.filter((option) => option !== item.answer)) {
      expect(item.prompt.toLocaleLowerCase("id-ID")).not.toContain(distractor.toLocaleLowerCase("id-ID"));
    }
  }
  return items;
}

describe("createClozeItems", () => {
  it("mengambil jawaban dari kalimat kartu dan mengganti satu kemunculan dengan blank", () => {
    const learningModule = buildModule("Fotosintesis menghasilkan glukosa. Klorofil menyerap cahaya. Enzim membantu reaksi kimia. Tumbuhan menyimpan cadangan pati.")!;
    const items = expectValidItems(learningModule);
    expect(items.length).toBeGreaterThan(0);
  });

  it("menjaga kelas leksikal untuk kata, angka, dan notasi", () => {
    const numericBase = buildModule("Nilai 1234 diukur dengan alat pertama. Nilai 2345 diukur dengan alat kedua. Nilai 3456 diukur dengan alat ketiga. Nilai 4567 diukur dengan alat keempat.")!;
    const notationBase = buildModule("Nilai O(1234) dihitung konstan. Nilai log(n) dihitung logarithm. Nilai n^2024 dihitung kuadrat. Nilai sqrt(n) dihitung akar.")!;
    const oneSentencePerCard = (base: Module): Module => ({
      ...base,
      cards: base.cards.flatMap((card) => card.sentences).map((sentence, index) => ({
        ...base.cards[0], id: `single-${index}`, index, text: sentence, sentences: [sentence],
        keywords: [...sentence.matchAll(/[^\s.,;:!?“”"'…]+/gu)].map((match) => match[0]),
      })),
    });
    const numericItems = expectValidItems(oneSentencePerCard(numericBase));
    const notationItems = expectValidItems(oneSentencePerCard(notationBase));
    expect(numericItems.some((item) => lexicalClass(item.answer) === "numeric")).toBe(true);
    expect(notationItems.some((item) => lexicalClass(item.answer) === "notation")).toBe(true);
  });

  it("deterministik dan tidak mengubah learningModule", () => {
    const learningModule = buildModule(SAMPLES[0].content)!;
    const before = JSON.stringify(learningModule);
    expect(JSON.stringify(createClozeItems(learningModule, "sama"))).toBe(JSON.stringify(createClozeItems(learningModule, "sama")));
    expect(JSON.stringify(learningModule)).toBe(before);
  });

  it("melewati kartu ketika kandidat sekelas tidak cukup", () => {
    const insufficient = buildModule("Kucing tidur. Kucing makan.")!;
    expect(createClozeItems(insufficient)).toEqual([]);
    const noCandidates = buildModule("Aku dan kamu di sini.")!;
    expect(createClozeItems(noCandidates)).toEqual([]);
  });

  it("melewati jawaban yang masih bocor melalui kemunculan lain di prompt", () => {
    const base = buildModule("Klorofil membantu klorofil. Klorofil menyerap cahaya. Tumbuhan menyimpan pati. Enzim menggerakkan reaksi.")!;
    const singleCard = { ...base, cards: [{ ...base.cards[0], sentences: [base.cards[0].sentences[0]] }] };
    expect(createClozeItems(singleCard).some((item) => item.answer === "Klorofil")).toBe(false);
  });

  it("hanya memakai keyword yang muncul utuh di kalimat sumber", () => {
    const base = buildModule("Fotosintesis menghasilkan glukosa. Klorofil menyerap cahaya. Enzim membantu reaksi kimia. Tumbuhan menyimpan pati.")!;
    const missingKeyword = {
      ...base,
      cards: base.cards.map((card) => ({ ...card, keywords: [...card.keywords, "mitokondria"] })),
    };
    expect(createClozeItems(missingKeyword).some((item) => item.answer === "mitokondria")).toBe(false);
  });

  it("melewati kartu tanpa keyword layak meskipun kalimatnya memiliki kata lain", () => {
    const base = buildModule("Fotosintesis menghasilkan glukosa. Klorofil menyerap cahaya. Enzim membantu reaksi kimia. Tumbuhan menyimpan pati.")!;
    const withoutKeywords = {
      ...base,
      cards: base.cards.map((card, index) => ({ ...card, keywords: index === 0 ? [] : card.keywords })),
    };
    expect(createClozeItems(withoutKeywords).map((item) => item.cardId)).not.toContain(base.cards[0].id);
  });

  it.each(["kemudian", "hanya", "melalui", "kali"])("memfilter kata fungsi %s", (functionWord) => {
    expect(STOPWORDS.has(functionWord)).toBe(true);
  });

  it.each(SAMPLES.map((sample) => [sample.id, sample.content] as const))("menghasilkan kuis valid untuk sampel %s", (_id, content) => {
    const learningModule = buildModule(content)!;
    const items = expectValidItems(learningModule, learningModule.id);
    console.info(`${_id}: ${items.length} soal dari ${learningModule.cards.length} kartu`);
    expect(items.length).toBeGreaterThan(0);
  });
});
