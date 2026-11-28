import { describe, expect, it } from "vitest";
import { buildWordTimings, estimateWordDurationMs } from "@/lib/tts/timingFallback";

describe("estimasi durasi kata", () => {
  it("memberi durasi lebih panjang untuk kata dengan lebih banyak huruf", () => {
    expect(estimateWordDurationMs("memperjuangkan", 1)).toBeGreaterThan(
      estimateWordDurationMs("aku", 1),
    );
  });

  it("menambah jeda sesuai tanda baca", () => {
    expect(estimateWordDurationMs("kata,", 1)).toBeGreaterThan(estimateWordDurationMs("kata", 1));
    expect(estimateWordDurationMs("kata.", 1)).toBeGreaterThan(estimateWordDurationMs("kata,", 1));
  });

  it("memperpendek durasi ketika rate naik", () => {
    expect(estimateWordDurationMs("membaca", 2)).toBeLessThan(estimateWordDurationMs("membaca", 1));
  });

  it("aman dan deterministik untuk input tidak lazim", () => {
    for (const token of ["", "...", "   "]) {
      for (const rate of [Number.NaN, -1, 0, 100]) {
        expect(estimateWordDurationMs(token, rate)).toBeGreaterThanOrEqual(0);
        expect(Number.isFinite(estimateWordDurationMs(token, rate))).toBe(true);
      }
    }
    expect(buildWordTimings(["aku", "membaca."], 1.25)).toEqual(
      buildWordTimings(["aku", "membaca."], 1.25),
    );
  });

  it("menghasilkan timing berurutan tanpa overlap", () => {
    const timings = buildWordTimings(["aku", "membaca,", "lalu", "istirahat."], 1);
    expect(timings).toHaveLength(4);
    expect(timings[0].startMs).toBe(0);
    timings.forEach((timing, index) => {
      expect(timing.endMs).toBeGreaterThanOrEqual(timing.startMs);
      if (index > 0) expect(timing.startMs).toBe(timings[index - 1].endMs);
    });
  });

  it("aman untuk daftar token kosong", () => {
    expect(buildWordTimings([], 1)).toEqual([]);
  });
});
