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
        Profil tampilan
      </h2>
      <p className="mt-1 text-sm text-[var(--ba-muted)]">
        Pilih titik awal warna dan tipografi yang paling nyaman.
      </p>

      <div
        role="radiogroup"
        aria-labelledby="profile-presets-title"
        className="mt-4 grid gap-3"
      >
        {PROFILE_IDS.map((profileId) => {
          const profile = PROFILE_INFO[profileId];
          const isSelected = activeProfile === profileId;
          const descriptionId = `profile-${profileId}-description`;

          return (
            <label
              key={profileId}
              data-selected={isSelected}
              className="flex min-h-20 cursor-pointer gap-3 rounded-xl border-2 border-[var(--ba-border-ui)] p-4 data-[selected=true]:border-[var(--ba-accent)] data-[selected=true]:bg-[var(--ba-surface)]"
            >
              <input
                type="radio"
                name="reading-profile"
                value={profileId}
                checked={isSelected}
                aria-describedby={descriptionId}
                onChange={() => onSelect(profileId)}
                className="mt-1 size-5 shrink-0 accent-[var(--ba-accent)]"
              />
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1 font-bold">
                  {profile.label}
                  {isSelected && isCustom ? (
                    <span className="text-sm font-normal text-[var(--ba-muted)]">
                      (disesuaikan)
                    </span>
                  ) : null}
                </span>
                <span
                  id={descriptionId}
                  className="mt-1 block text-sm text-[var(--ba-muted)]"
                >
                  {profile.description}
                </span>
                {isSelected ? (
                  <span className="mt-2 block text-sm font-bold text-[var(--ba-accent)]">
                    <span aria-hidden="true">✓ </span>Dipilih
                  </span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
    </section>
  );
}
