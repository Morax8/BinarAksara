import {
  DEFAULT_PREFERENCES,
  PROFILE_IDS,
  PROFILE_PRESETS,
} from "@/lib/profiles";
import { FONT_STACKS } from "@/lib/profiles";
import type { FontFamilyId, Preferences, ProfileId } from "@/types";

export const PREFERENCES_STORAGE_KEY = "binaraksara:preferences:v1";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isProfileId(value: unknown): value is ProfileId {
  return (
    typeof value === "string" &&
    (PROFILE_IDS as readonly string[]).includes(value)
  );
}

function validNumber(
  value: unknown,
  fallback: number,
  minimum: number,
  maximum: number,
): number {
  return typeof value === "number" &&
    Number.isFinite(value) &&
    value >= minimum &&
    value <= maximum
    ? value
    : fallback;
}

function validBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function sanitizePreferences(value: unknown): Preferences | null {
  if (!isRecord(value)) return null;

  const activeProfile = isProfileId(value.activeProfile)
    ? value.activeProfile
    : DEFAULT_PREFERENCES.activeProfile;
  const fallback = PROFILE_PRESETS[activeProfile];
  const fontFamily: FontFamilyId =
    typeof value.fontFamily === "string" && Object.hasOwn(FONT_STACKS, value.fontFamily)
      ? (value.fontFamily as FontFamilyId)
      : fallback.fontFamily;
  const measure =
    typeof value.measure === "string" && /^(?:[1-9]|[1-9]\d|100)ch$/.test(value.measure)
      ? value.measure
      : fallback.measure;

  return {
    activeProfile,
    fontFamily,
    fontScale: validNumber(value.fontScale, fallback.fontScale, 0.9, 2),
    lineHeight: validNumber(value.lineHeight, fallback.lineHeight, 1.4, 2.2),
    letterSpacing: validNumber(
      value.letterSpacing,
      fallback.letterSpacing,
      0,
      0.2,
    ),
    wordSpacing: validNumber(value.wordSpacing, fallback.wordSpacing, 0, 0.3),
    measure,
    rulerEnabled: validBoolean(value.rulerEnabled, fallback.rulerEnabled),
    bionicEnabled: validBoolean(value.bionicEnabled, fallback.bionicEnabled),
    syllabificationEnabled: validBoolean(
      value.syllabificationEnabled,
      fallback.syllabificationEnabled,
    ),
    ttsRate: validNumber(value.ttsRate, fallback.ttsRate, 0.5, 2),
  };
}

export function loadPreferences(): Preferences | null {
  if (typeof window === "undefined") return null;

  try {
    const serialized = window.localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (serialized === null) return null;
    return sanitizePreferences(JSON.parse(serialized));
  } catch {
    return null;
  }
}

export function savePreferences(preferences: Preferences): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      PREFERENCES_STORAGE_KEY,
      JSON.stringify(preferences),
    );
  } catch {
    // Penyimpanan dapat tidak tersedia; preferensi tetap berlaku di memori.
  }
}
