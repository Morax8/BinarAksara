"use client";

import { PROFILE_IDS, PROFILE_INFO } from "@/lib/profiles";
import type { ProfileId } from "@/types";

interface ProfilePresetsProps {
  activeProfile: ProfileId;
  isCustom: boolean;
  onSelect: (profileId: ProfileId) => void;
}

export default function ProfilePresets({
  activeProfile,
  isCustom,
  onSelect,
}: ProfilePresetsProps) {
  return (
    <section aria-labelledby="profile-presets-title">
      <h2 id="profile-presets-title" className="text-xl font-bold">
        Pilih profil tampilan
      </h2>
      <p className="mt-1 text-sm text-[var(--ba-muted)]">
        Satu klik untuk menyesuaikan warna dan tipografi bacaan.
      </p>

      <fieldset
        aria-labelledby="profile-presets-title"
        className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4"
      >
        <legend className="sr-only">Profil tampilan</legend>
        {PROFILE_IDS.map((profileId) => {
          const profile = PROFILE_INFO[profileId];
          const isSelected = activeProfile === profileId;

          return (
            <label
              key={profileId}
              data-selected={isSelected}
              className="flex min-h-11 cursor-pointer flex-wrap content-center items-center gap-x-2 gap-y-1 rounded-lg border-2 border-[var(--ba-border-ui)] px-3 py-2 font-bold focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-[var(--ba-focus)] data-[selected=true]:border-[var(--ba-accent)] data-[selected=true]:bg-[var(--ba-surface)]"
            >
              <input
                type="radio"
                name="reading-profile"
                value={profileId}
                checked={isSelected}
                aria-describedby={isSelected ? "active-profile-description" : undefined}
                onChange={() => onSelect(profileId)}
                className="size-5 shrink-0 accent-[var(--ba-accent)]"
              />
              <span>{profile.label}</span>
              {isSelected ? (
                <span className="w-full pl-7 text-sm text-[var(--ba-accent)]">
                  <span aria-hidden="true">✓ </span>Dipilih
                  {isCustom ? " (disesuaikan)" : ""}
                </span>
              ) : null}
            </label>
          );
        })}
      </fieldset>
      <p id="active-profile-description" className="mt-3 text-sm text-[var(--ba-muted)]">
        {PROFILE_INFO[activeProfile].description}
      </p>
    </section>
  );
}
