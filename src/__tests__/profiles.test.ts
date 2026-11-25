import { describe, expect, it } from "vitest";
import {
  DEFAULT_PREFERENCES,
  PROFILE_IDS,
  PROFILE_PRESETS,
  type ThemePreferences,
} from "@/lib/profiles";
import type { ProfileId } from "@/types";

const EXPECTED_TYPOGRAPHY: Record<
  ProfileId,
  Pick<
    ThemePreferences,
    "fontScale" | "lineHeight" | "letterSpacing" | "wordSpacing" | "measure"
  >
> = {
  standar: {
    fontScale: 1,
    lineHeight: 1.6,
    letterSpacing: 0,
    wordSpacing: 0,
    measure: "65ch",
  },
  disleksia: {
    fontScale: 1.1,
    lineHeight: 1.8,
    letterSpacing: 0.03,
    wordSpacing: 0.16,
    measure: "60ch",
  },
  adhd: {
    fontScale: 1.1,
    lineHeight: 1.75,
    letterSpacing: 0.01,
    wordSpacing: 0.02,
    measure: "55ch",
  },
  lowVision: {
    fontScale: 1.45,
    lineHeight: 1.8,
    letterSpacing: 0.01,
    wordSpacing: 0.04,
    measure: "50ch",
  },
};

const PREFERENCE_KEYS = [
  "activeProfile",
  "fontFamily",
  "fontScale",
  "lineHeight",
  "letterSpacing",
  "wordSpacing",
  "measure",
  "rulerEnabled",
  "bionicEnabled",
  "syllabificationEnabled",
  "ttsRate",
].sort();

describe("preset profil", () => {
  it("memiliki empat profil sesuai urutan yang disepakati", () => {
    expect(PROFILE_IDS).toEqual(["standar", "disleksia", "adhd", "lowVision"]);
  });

  it.each(PROFILE_IDS)(
    "profil %s lengkap dan sesuai tabel tipografi",
    (profileId) => {
      const preset = PROFILE_PRESETS[profileId];

      expect(Object.keys(preset).sort()).toEqual(PREFERENCE_KEYS);
      expect(preset.activeProfile).toBe(profileId);
      expect(preset).toMatchObject(EXPECTED_TYPOGRAPHY[profileId]);
      expect(preset.fontFamily.trim()).not.toBe("");
      expect(preset.fontScale).toBeGreaterThanOrEqual(0.9);
      expect(preset.fontScale).toBeLessThanOrEqual(2);
      expect(preset.lineHeight).toBeGreaterThanOrEqual(1.4);
      expect(preset.lineHeight).toBeLessThanOrEqual(2.2);
      expect(preset.letterSpacing).toBeGreaterThanOrEqual(0);
      expect(preset.letterSpacing).toBeLessThanOrEqual(0.2);
      expect(preset.wordSpacing).toBeGreaterThanOrEqual(0);
      expect(preset.wordSpacing).toBeLessThanOrEqual(0.3);
      expect(preset.rulerEnabled).toBe(false);
      expect(preset.bionicEnabled).toBe(false);
      expect(preset.syllabificationEnabled).toBe(false);
      expect(preset.ttsRate).toBe(1);
    },
  );

  it("default sama dengan preset standar tetapi tidak berbagi objek", () => {
    expect(DEFAULT_PREFERENCES).toEqual(PROFILE_PRESETS.standar);
    expect(DEFAULT_PREFERENCES).not.toBe(PROFILE_PRESETS.standar);
  });
});
