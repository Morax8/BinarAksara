"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_PREFERENCES,
  PROFILE_PRESETS,
  FONT_STACKS,
} from "@/lib/profiles";
import { loadPreferences, savePreferences } from "@/lib/storage";
import type { Preferences, ProfileId } from "@/types";

export type PreferenceUpdate = Partial<
  Omit<Preferences, "activeProfile">
>;

function matchesActivePreset(preferences: Preferences): boolean {
  const preset = PROFILE_PRESETS[preferences.activeProfile];
  return (Object.keys(preset) as (keyof Preferences)[]).every(
    (key) => preferences[key] === preset[key],
  );
}

export function usePreferences() {
  const [preferences, setPreferences] = useState<Preferences>(
    DEFAULT_PREFERENCES,
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    const storedPreferences = loadPreferences();
    const timeoutId = window.setTimeout(() => {
      if (storedPreferences) {
        setPreferences(storedPreferences);
        setIsCustom(!matchesActivePreset(storedPreferences));
      }
      setIsLoaded(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const root = document.documentElement;
    root.dataset.profile = preferences.activeProfile;
    root.style.setProperty("--ba-font-scale", String(preferences.fontScale));
    root.style.setProperty("--ba-line-height", String(preferences.lineHeight));
    root.style.setProperty(
      "--ba-letter-spacing",
      `${preferences.letterSpacing}em`,
    );
    root.style.setProperty("--ba-word-spacing", `${preferences.wordSpacing}em`);
    root.style.setProperty("--ba-measure", preferences.measure);
    root.style.setProperty("--ba-font-reading", FONT_STACKS[preferences.fontFamily]);
    savePreferences(preferences);
  }, [isLoaded, preferences]);

  const applyProfile = useCallback((profileId: ProfileId) => {
    setPreferences({ ...PROFILE_PRESETS[profileId] });
    setIsCustom(false);
  }, []);

  const updatePreference = useCallback((partial: PreferenceUpdate) => {
    setPreferences((current) => ({ ...current, ...partial }));
    setIsCustom(true);
  }, []);

  const resetProfile = useCallback(() => {
    setPreferences((current) => ({
      ...PROFILE_PRESETS[current.activeProfile],
    }));
    setIsCustom(false);
  }, []);

  return {
    preferences,
    isLoaded,
    isCustom,
    applyProfile,
    updatePreference,
    resetProfile,
  };
}
