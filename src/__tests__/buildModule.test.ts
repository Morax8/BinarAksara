import { describe, expect, it } from "vitest";
import { buildModule } from "@/lib/nlp";

const SOURCE = "Fotosintesis berlangsung di kloroplas. Klorofil menyerap cahaya. Air dan karbon dioksida menghasilkan glukosa.";

describe("buildModule", () => {
  it("mengembalikan null untuk input kosong", () => {
    expect(buildModule("   \n ")).toBeNull();
  });

  it("deterministik dan menghasilkan struktur Module yang lengkap", () => {
    const first = buildModule(SOURCE, "Fotosintesis");
    const second = buildModule(SOURCE, "Fotosintesis");
    expect(first).toEqual(second);
    expect(first).not.toBeNull();
    expect(first!.id).toMatch(/^module-[0-9a-f]{8}$/);
    expect(first!.title).toBe("Fotosintesis");
    expect(first!.sourceText).toBe(SOURCE);
    expect(first!.cards).toHaveLength(1);
    expect(first!.cards[0]).toMatchObject({ id: "card-0", index: 0 });
    expect(first!.cards[0].tokens.length).toBeGreaterThan(0);
    expect(first!.cards[0].keywords.length).toBeGreaterThan(0);
    expect(first!.load.before.factors.cardCount).toBe(1);
    expect(first!.load.after.value).toBeGreaterThanOrEqual(0);
    expect(first!.load.after.value).toBeLessThanOrEqual(100);
  });

  it("mengisi setiap kartu dan menjaga seluruh isi kalimat", () => {
    const result = buildModule("Satu. Dua. Tiga. Empat.");
    expect(result!.cards.every((card) => card.text && card.sentences.length > 0)).toBe(true);
    expect(result!.cards.flatMap((card) => card.sentences)).toEqual(["Satu.", "Dua.", "Tiga.", "Empat."]);
  });
});
