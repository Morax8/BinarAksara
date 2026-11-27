import { describe, expect, it } from "vitest";
import { chunkCards, tokenize } from "@/lib/nlp";

describe("cards", () => {
  it("mempertahankan tanda baca pada token dan mengosongkan suku kata", () => {
    expect(tokenize("Air, cahaya!")).toEqual([
      { text: "Air,", syllables: [] },
      { text: "cahaya!", syllables: [] },
    ]);
  });

  it("membuat kartu tidak kosong dengan urutan dan isi yang terjaga", () => {
    const sentences = ["Kalimat satu.", "Kalimat dua.", "Kalimat tiga.", "Kalimat empat."];
    const cards = chunkCards(sentences);
    expect(cards.length).toBeGreaterThan(0);
    expect(cards.every((card) => card.text.length > 0)).toBe(true);
    expect(cards.map((card) => card.index)).toEqual(cards.map((_, index) => index));
    expect(cards.flatMap((card) => card.sentences)).toEqual(sentences);
    expect(cards.map((card) => card.text).join(" ")).toBe(sentences.join(" "));
  });

  it("hanya memecah kalimat panjang pada batas klausa yang aman", () => {
    const first = "Bagian pembuka menjelaskan konteks masalah secara terperinci bagi para pembaca awal";
    const second = "bagian kedua memberikan penjelasan tambahan yang cukup panjang dan terperinci";
    const third = "bagian ketiga menyimpulkan seluruh pembahasan dengan uraian yang sangat lengkap";
    const source = `${first}, tetapi ${second}, namun ${third}.`;
    const cards = chunkCards([source]);
    expect(cards.length).toBe(3);
    expect(cards.map((card) => card.text).join(" ")).toBe(source);
    expect(cards.every((card) => card.text.length >= 30)).toBe(true);
    expect(cards[0].text).toBe(`${first},`);
    expect(cards[1].text).toBe(`tetapi ${second},`);
    expect(cards[2].text).toBe(`namun ${third}.`);
    expect(cards.every((card) => !/(?:tetapi|namun|sehingga|sedangkan|kemudian)$/i.test(card.text))).toBe(true);
  });
});
