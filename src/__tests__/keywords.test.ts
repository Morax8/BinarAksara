import { describe, expect, it } from "vitest";
import { extractKeywords } from "@/lib/nlp";

describe("extractKeywords", () => {
  it("menyaring stopword, kata pendek, dan angka serta mengurutkan tie secara alfabet", () => {
    expect(extractKeywords("Air dan API serta 12345; Cahaya cahaya Belajar belajar."))
      .toEqual(["Belajar", "Cahaya"]);
  });

  it("menyaring kata kerja dan kata umum akademik dari kata kunci", () => {
    expect(extractKeywords(
      "Berarti bagaimana berlangsung digunakan menjadi dilakukan fotosintesis",
    )).toEqual(["fotosintesis"]);
  });

  it("deterministik, mempertahankan kapitalisasi awal, dan mematuhi limit", () => {
    const text = "Fotosintesis kloroplas Klorofil klorofil glukosa oksigen";
    const first = extractKeywords(text, 2);
    expect(first).toEqual(["Klorofil", "Fotosintesis"]);
    expect(first).toHaveLength(2);
    expect(extractKeywords(text, 2)).toEqual(first);
    expect(extractKeywords("yang dan itu", 0)).toEqual([]);
  });
});
