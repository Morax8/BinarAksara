import type { Preferences } from "@/types";

export function loadPreferences(): Preferences | null {
  if (typeof window === "undefined") return null;

  try {
    void window.localStorage; // TODO(Storage): baca preferensi tersimpan
    return null;
  } catch {
    return null;
  }
}

export function savePreferences(preferences: Preferences): void {
  void preferences; // TODO(Storage): simpan preferensi pengguna
  if (typeof window === "undefined") return;

  try {
    void window.localStorage;
  } catch {
    // Penyimpanan dapat tidak tersedia; preferensi tetap berlaku di memori.
  }
}
