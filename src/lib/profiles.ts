import type { Preferences, ProfileId } from "@/types";

export const PROFILE_IDS = [
  "standar",
  "disleksia",
  "adhd",
  "lowVision",
] as const;

const SYSTEM_FONT_STACK =
  'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

export const DEFAULT_PREFERENCES: Preferences = {
  activeProfile: "standar",
  fontFamily: SYSTEM_FONT_STACK,
  fontScale: 1,
  lineHeight: 1.6,
  letterSpacing: 0,
  wordSpacing: 0,
  measure: "65ch",
  rulerEnabled: false,
  bionicEnabled: false,
  syllabificationEnabled: false,
  ttsRate: 1,
};

// Nilai preset adalah titik awal desain, bukan klaim medis.
export const PROFILE_PRESETS: Record<ProfileId, Preferences> = {
  standar: { ...DEFAULT_PREFERENCES },
  disleksia: {
    ...DEFAULT_PREFERENCES,
    activeProfile: "disleksia",
    fontScale: 1.1,
    lineHeight: 1.8,
    letterSpacing: 0.03,
    wordSpacing: 0.16,
    measure: "60ch",
  },
  adhd: {
    ...DEFAULT_PREFERENCES,
    activeProfile: "adhd",
    fontScale: 1.1,
    lineHeight: 1.75,
    letterSpacing: 0.01,
    wordSpacing: 0.02,
    measure: "55ch",
  },
  lowVision: {
    ...DEFAULT_PREFERENCES,
    activeProfile: "lowVision",
    fontScale: 1.45,
    lineHeight: 1.8,
    letterSpacing: 0.01,
    wordSpacing: 0.04,
    measure: "50ch",
  },
};

export const PROFILE_INFO: Record<
  ProfileId,
  { label: string; description: string }
> = {
  standar: {
    label: "Standar",
    description: "Tampilan ringkas dengan tipografi seimbang untuk membaca umum.",
  },
  disleksia: {
    label: "Disleksia",
    description:
      "Ruang antarhuruf dan antarkata lebih lega dengan latar krem yang lembut.",
  },
  adhd: {
    label: "ADHD",
    description:
      "Kolom baca lebih ringkas dengan aksen teal untuk membantu menjaga fokus.",
  },
  lowVision: {
    label: "Low Vision",
    description:
      "Teks lebih besar dengan latar gelap dan warna berkontras tinggi.",
  },
};
