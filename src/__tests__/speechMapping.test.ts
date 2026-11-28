import { describe, expect, it } from "vitest";
import { charIndexToTokenIndex } from "@/lib/tts/speaker";

describe("charIndexToTokenIndex", () => {
  const tokens = ["Halo,", "dunia!", "Apa", "kabar?"];

  it("memetakan indeks di awal, tengah, dan akhir kata", () => {
    expect(charIndexToTokenIndex(tokens, 0)).toBe(0);
    expect(charIndexToTokenIndex(tokens, 2)).toBe(0);
    expect(charIndexToTokenIndex(tokens, 4)).toBe(0);
    expect(charIndexToTokenIndex(tokens, 6)).toBe(1);
    expect(charIndexToTokenIndex(tokens, 10)).toBe(1);
    expect(charIndexToTokenIndex(tokens, 19)).toBe(3);
  });

  it("mengabaikan spasi berlebih antar token", () => {
    expect(charIndexToTokenIndex(["aku", "membaca"], 7)).toBe(1);
    expect(charIndexToTokenIndex(["aku", "membaca"], 10)).toBe(1);
  });

  it("mengembalikan null di luar teks", () => {
    expect(charIndexToTokenIndex(tokens, -1)).toBeNull();
    expect(charIndexToTokenIndex(tokens, 100)).toBeNull();
  });
});
