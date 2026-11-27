"use client";

import type { PreferenceUpdate } from "@/hooks/usePreferences";
import { PROFILE_INFO } from "@/lib/profiles";
import type { Preferences } from "@/types";

type NumericPreferenceKey =
  | "fontScale"
  | "lineHeight"
  | "letterSpacing"
  | "wordSpacing";

interface SettingDefinition {
  key: NumericPreferenceKey;
  label: string;
  minimum: number;
  maximum: number;
  step: number;
}

const SETTINGS: SettingDefinition[] = [
  {
    key: "fontScale",
    label: "Ukuran teks",
    minimum: 0.9,
    maximum: 2,
    step: 0.05,
  },
  {
    key: "lineHeight",
    label: "Spasi baris",
    minimum: 1.4,
    maximum: 2.2,
    step: 0.05,
  },
  {
    key: "letterSpacing",
    label: "Spasi huruf",
    minimum: 0,
    maximum: 0.2,
    step: 0.01,
  },
  {
    key: "wordSpacing",
    label: "Spasi kata",
    minimum: 0,
    maximum: 0.3,
    step: 0.02,
  },
];

interface ManualSettingsProps {
  preferences: Preferences;
  onChange: (partial: PreferenceUpdate) => void;
  onReset: () => void;
}

function formatValue(key: NumericPreferenceKey, value: number): string {
  if (key === "fontScale") return `${value.toFixed(2)}×`;
  if (key === "lineHeight") return value.toFixed(2);
  return `${value.toFixed(2)} em`;
}

export default function ManualSettings({
  preferences,
  onChange,
  onReset,
}: ManualSettingsProps) {
  function updateSetting(key: NumericPreferenceKey, value: number) {
    onChange({ [key]: value });
  }

  return (
    <section aria-labelledby="manual-settings-title" className="mt-8">
      <h2 id="manual-settings-title" className="text-xl font-bold">
        Pengaturan manual
      </h2>
      <p className="mt-1 text-sm text-[var(--ba-muted)]">
        Penyesuaian langsung diterapkan pada pratinjau baca.
      </p>

      <div className="mt-5 grid gap-6">
        {SETTINGS.map((setting) => {
          const inputId = `setting-${setting.key}`;
          const value = preferences[setting.key];
          const formattedValue = formatValue(setting.key, value);

          return (
            <div key={setting.key}>
              <div className="flex items-center justify-between gap-4">
                <label htmlFor={inputId} className="font-semibold">
                  {setting.label}
                </label>
                <output
                  htmlFor={inputId}
                  className="text-sm font-bold tabular-nums"
                >
                  {formattedValue}
                </output>
              </div>
              <input
                id={inputId}
                type="range"
                min={setting.minimum}
                max={setting.maximum}
                step={setting.step}
                value={value}
                aria-valuetext={formattedValue}
                onChange={(event) =>
                  updateSetting(setting.key, Number(event.currentTarget.value))
                }
                className="mt-3 h-11 w-full cursor-pointer accent-[var(--ba-accent)]"
              />
              <div
                aria-hidden="true"
                className="flex justify-between gap-4 text-sm text-[var(--ba-muted)]"
              >
                <span>{formatValue(setting.key, setting.minimum)}</span>
                <span>{formatValue(setting.key, setting.maximum)}</span>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-7 min-h-12 rounded-lg border-2 border-[var(--ba-border-ui)] px-4 py-2 font-bold text-[var(--ba-fg)] hover:bg-[var(--ba-bg)]"
      >
        Kembalikan preset {PROFILE_INFO[preferences.activeProfile].label}
      </button>
    </section>
  );
}
