import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_PREFERENCES } from "@/lib/profiles";
import {
  loadPreferences,
  PREFERENCES_STORAGE_KEY,
  savePreferences,
} from "@/lib/storage";

describe("penyimpanan preferensi", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("memuat kembali preferensi yang disimpan", () => {
    const preferences = {
      ...DEFAULT_PREFERENCES,
      activeProfile: "disleksia" as const,
      fontScale: 1.35,
      lineHeight: 1.95,
      letterSpacing: 0.05,
      wordSpacing: 0.12,
      measure: "60ch",
    };

    savePreferences(preferences);

    expect(loadPreferences()).toEqual(preferences);
  });

  it("mengembalikan null ketika data tidak ada atau JSON rusak", () => {
    expect(loadPreferences()).toBeNull();

    window.localStorage.setItem(PREFERENCES_STORAGE_KEY, "{bukan-json");
    expect(loadPreferences()).toBeNull();
  });

  it("aman ketika localStorage melempar error", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage diblokir", "SecurityError");
    });
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("Storage diblokir", "SecurityError");
    });

    expect(() => savePreferences(DEFAULT_PREFERENCES)).not.toThrow();
    expect(loadPreferences()).toBeNull();
  });

  it("mengisi field baru dari preset default", () => {
    const legacyPreferences: Record<string, unknown> = {
      ...DEFAULT_PREFERENCES,
      fontScale: 1.25,
    };
    delete legacyPreferences.wordSpacing;
    delete legacyPreferences.measure;
    delete legacyPreferences.ttsRate;

    window.localStorage.setItem(
      PREFERENCES_STORAGE_KEY,
      JSON.stringify(legacyPreferences),
    );

    expect(loadPreferences()).toEqual({
      ...DEFAULT_PREFERENCES,
      fontScale: 1.25,
    });
  });

  it("menolak nilai di luar rentang dan tipe yang salah", () => {
    window.localStorage.setItem(
      PREFERENCES_STORAGE_KEY,
      JSON.stringify({
        ...DEFAULT_PREFERENCES,
        activeProfile: "profil-asing",
        fontScale: 3,
        lineHeight: "longgar",
        letterSpacing: -0.1,
        wordSpacing: 0.5,
        rulerEnabled: "ya",
        ttsRate: 0,
      }),
    );

    expect(loadPreferences()).toEqual(DEFAULT_PREFERENCES);
  });

  it("membuang field yang tidak dikenal", () => {
    window.localStorage.setItem(
      PREFERENCES_STORAGE_KEY,
      JSON.stringify({
        ...DEFAULT_PREFERENCES,
        fieldAsing: "tidak boleh disimpan",
      }),
    );

    const loaded = loadPreferences();
    expect(loaded).toEqual(DEFAULT_PREFERENCES);
    expect(loaded).not.toHaveProperty("fieldAsing");
  });
});
