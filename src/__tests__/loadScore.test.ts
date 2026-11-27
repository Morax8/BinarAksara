import { describe, expect, it } from "vitest";
import { calculateLoadScore } from "@/lib/nlp";

describe("calculateLoadScore", () => {
  it("menghitung faktor pada contoh kecil secara transparan", () => {
    const score = calculateLoadScore("Kucing tidur. Burung jauh; dia berhenti.");
    expect(score.factors).toEqual({
      avgSentenceWords: 3,
      longWordRatio: 0,
      avgClausesPerSentence: 1.5,
      cardCount: 1,
    });
    expect(score.value).toBe(14);
    expect(score.label).toBe("rendah");
  });

  it("memberi nilai lebih tinggi pada kalimat panjang daripada teks sederhana", () => {
    const simple = calculateLoadScore("Kucing tidur. Burung terbang. Ikan berenang.");
    const complex = calculateLoadScore(
      "Mahasiswa mempelajari karakteristik fotosintesis, tetapi pengimplementasiannya memerlukan pemahaman interdisipliner, sehingga penyelesaian permasalahan membutuhkan pertimbangan.",
    );
    expect(complex.value).toBeGreaterThan(simple.value);
  });

  it("selalu membatasi nilai 0-100 dan memberi label sesuai ambang", () => {
    const empty = calculateLoadScore("   ");
    expect(empty).toMatchObject({ value: 0, label: "rendah" });
    expect(empty.factors.cardCount).toBe(0);
    const high = calculateLoadScore(
      `${"pengimplementasian ".repeat(60)}; ${"interdisipliner ".repeat(40)}.`,
    );
    expect(high.value).toBeLessThanOrEqual(100);
    expect(high.label).toBe("tinggi");
  });
});
