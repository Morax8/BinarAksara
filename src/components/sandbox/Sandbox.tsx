"use client";

import { useState } from "react";
import ManualSettings from "@/components/controls/ManualSettings";
import ProfilePresets from "@/components/controls/ProfilePresets";
import ReaderView from "@/components/reader/ReaderView";
import { usePreferences } from "@/hooks/usePreferences";

export default function Sandbox() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const {
    preferences,
    isCustom,
    applyProfile,
    updatePreference,
    resetProfile,
  } = usePreferences();

  return (
    <div className="min-h-full bg-[var(--ba-bg)] text-[var(--ba-fg)]">
      <header className="border-b border-[var(--ba-border)] bg-[var(--ba-surface)]">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-8">
          <p className="text-sm font-bold tracking-wide text-[var(--ba-accent)]">
            Pendamping belajar adaptif
          </p>
          <h1 className="mt-1 text-3xl font-extrabold md:text-4xl">
            BinarAksara
          </h1>
          <p className="mt-2 text-lg text-[var(--ba-muted)]">
            Satu materi, banyak cara membaca.
          </p>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] md:items-start md:gap-8 md:px-8 md:py-8">
        <section
          aria-label="Pratinjau baca"
          className="order-1 min-w-0 md:order-2"
        >
          <h2 className="mb-3 text-xl font-bold">Pratinjau baca</h2>
          <ReaderView />
        </section>

        <div className="order-2 min-w-0 md:order-1">
          <button
            type="button"
            aria-expanded={settingsOpen}
            aria-controls="pengaturan-tampilan"
            onClick={() => setSettingsOpen((open) => !open)}
            className="flex min-h-12 w-full items-center justify-between gap-4 rounded-xl border-2 border-[var(--ba-border-ui)] bg-[var(--ba-surface)] px-4 py-3 text-left font-bold md:hidden"
          >
            Sesuaikan tampilan
            <span aria-hidden="true" className="text-2xl leading-none">
              {settingsOpen ? "−" : "+"}
            </span>
          </button>

          <div
            id="pengaturan-tampilan"
            className={`${settingsOpen ? "block" : "hidden"} mt-4 rounded-2xl border border-[var(--ba-border)] bg-[var(--ba-surface)] p-6 md:mt-0 md:block md:p-8`}
          >
            <h2 className="mb-5 hidden text-2xl font-bold md:block">
              Sesuaikan tampilan
            </h2>
            <ProfilePresets
              activeProfile={preferences.activeProfile}
              isCustom={isCustom}
              onSelect={applyProfile}
            />
            <ManualSettings
              preferences={preferences}
              onChange={updatePreference}
              onReset={resetProfile}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
