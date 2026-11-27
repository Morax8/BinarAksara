import { describe, expect, it } from "vitest";
import { splitSentences } from "@/lib/nlp";

const normalized = (text: string) => text.replace(/\s+/g, " ").trim();

describe("splitSentences", () => {
  it("tidak memotong singkatan akademik, desimal, format angka, dan kompleksitas", () => {
    expect(
      splitSentences(
        "Prof. Dr. H. Ahmad, M.Kom. menjelaskan nilai 3,14 dan 1.000. Algoritma O(n^2) dibahas dkk. secara rinci.",
      ),
    ).toEqual([
      "Prof. Dr. H. Ahmad, M.Kom. menjelaskan nilai 3,14 dan 1.000.",
      "Algoritma O(n^2) dibahas dkk. secara rinci.",
    ]);
  });

  it("menangani tanda tanya, seru, elipsis, tanda kutip, dan paragraf", () => {
    expect(splitSentences('Siap? Ya! "Belajar..." katanya.\n\nParagraf baru… Lanjut.')).toEqual([
      "Siap?",
      "Ya!",
      '"Belajar..." katanya.',
      "Paragraf baru…",
      "Lanjut.",
    ]);
  });

  it("tidak menghasilkan kalimat kosong dan mempertahankan seluruh isi", () => {
    const source = "  Kalimat   pertama.   Kalimat kedua!\n\n  Kalimat ketiga?  ";
    const sentences = splitSentences(source);
    expect(sentences.every((sentence) => sentence.length > 0)).toBe(true);
    expect(normalized(sentences.join(" "))).toBe(normalized(source));
  });
});
