import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("src/app/print.css", "utf8");

describe("invariant stylesheet cetak", () => {
  it("menyembunyikan layout dari layar dan aplikasi dari hasil cetak", () => {
    expect(css).toMatch(/\.print-layout\s*\{\s*display:\s*none;/);
    expect(css).toMatch(/@media print[\s\S]*\.app-screen,[\s\S]*display:\s*none\s*!important/);
  });

  it("memetakan profil gelap ke kertas terang dan mewarisi tipografi aktif", () => {
    expect(css).toContain("color-scheme: light !important");
    expect(css).toContain("background: #ffffff !important");
    expect(css).toContain("font-family: var(--ba-font-reading)");
    expect(css).toContain("calc(12pt * var(--ba-font-scale))");
    expect(css).toContain("line-height: var(--ba-line-height)");
    expect(css).toContain("letter-spacing: var(--ba-letter-spacing)");
    expect(css).toContain("word-spacing: var(--ba-word-spacing)");
    expect(css).toContain("max-width: var(--ba-measure)");
    expect(css).toContain("overflow-wrap: anywhere");
    expect(css).toMatch(/@page\s*\{\s*margin:\s*16mm/);
  });
});
