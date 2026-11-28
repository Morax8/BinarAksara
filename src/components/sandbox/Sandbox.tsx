"use client";

import { useEffect, useRef, useState } from "react";
import ManualSettings from "@/components/controls/ManualSettings";
import ProfilePresets from "@/components/controls/ProfilePresets";
import CognitiveLoadMeter from "@/components/meter/CognitiveLoadMeter";
import CardReader from "@/components/reader/CardReader";
import ReaderView from "@/components/reader/ReaderView";
import ReadingRuler from "@/components/reader/ReadingRuler";
import BeforeAfterToggle from "./BeforeAfterToggle";
import InputPanel from "./InputPanel";
import { SAMPLES } from "@/data/samples";
import { useModule } from "@/hooks/useModule";
import { usePreferences } from "@/hooks/usePreferences";

export default function Sandbox() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [source, setSource] = useState({
    text: SAMPLES[0].content,
    title: SAMPLES[0].title,
    sampleId: SAMPLES[0].id as string | null,
  });
  const [mode, setMode] = useState<"full" | "card">("full");
  const [focusMode, setFocusMode] = useState(false);
  const [lineHeight, setLineHeight] = useState(28.8);
  const readingAreaRef = useRef<HTMLDivElement>(null);
  const focusButtonRef = useRef<HTMLButtonElement>(null);
  const returnButtonRef = useRef<HTMLButtonElement>(null);
  const learningModule = useModule(source.text);
  const {
    preferences,
    isCustom,
    applyProfile,
    updatePreference,
    resetProfile,
  } = usePreferences();

  useEffect(() => {
    if (focusMode) returnButtonRef.current?.focus();
  }, [focusMode]);

  useEffect(() => {
    if (!preferences.rulerEnabled || !learningModule) return;
    const area = readingAreaRef.current;
    if (!area) return;
    const updateLineHeight = () => {
      const value = Number.parseFloat(window.getComputedStyle(area).lineHeight);
      if (Number.isFinite(value) && value > 0) setLineHeight(value);
    };
    updateLineHeight();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateLineHeight) : null;
    observer?.observe(area);
    return () => observer?.disconnect();
  }, [mode, learningModule, preferences]);

  function selectSample(id: string) {
    const sample = SAMPLES.find((item) => item.id === id);
    if (!sample) return;
    setSource({ text: sample.content, title: sample.title, sampleId: sample.id });
    setFocusMode(false);
  }

  function applyText(text: string, title: string) {
    setSource({ text, title, sampleId: null });
    setFocusMode(false);
  }

  const reading = learningModule ? (
    mode === "card" ? <CardReader key={learningModule.id} module={learningModule} rate={preferences.ttsRate} onRateChange={(rate) => updatePreference({ ttsRate: rate })} /> : <ReaderView module={learningModule} rate={preferences.ttsRate} onRateChange={(rate) => updatePreference({ ttsRate: rate })} />
  ) : null;

  return (
    <div className="min-h-full bg-[var(--ba-bg)] text-[var(--ba-fg)]">
      {!focusMode && (
        <header className="border-b border-[var(--ba-border)] bg-[var(--ba-surface)]">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-8">
            <p className="text-sm font-bold tracking-wide text-[var(--ba-accent)]">Pendamping belajar adaptif</p>
            <h1 className="mt-1 text-3xl font-extrabold md:text-4xl">BinarAksara</h1>
            <p className="mt-2 text-lg text-[var(--ba-muted)]">Satu materi, banyak cara membaca.</p>
          </div>
        </header>
      )}

      {!focusMode && (
        <div className="mx-auto w-full max-w-6xl px-4 pt-6 md:px-8">
          <ProfilePresets activeProfile={preferences.activeProfile} isCustom={isCustom} onSelect={applyProfile} />
        </div>
      )}

      <div className={`${focusMode ? "max-w-4xl" : "max-w-6xl md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] md:gap-8"} mx-auto grid w-full gap-6 px-4 py-6 md:grid md:items-start md:px-8`}>
        <section aria-label="Pratinjau baca" className="order-1 min-w-0 md:order-2">
          {!focusMode && <h2 className="mb-3 text-xl font-bold">Pratinjau baca</h2>}
          {learningModule ? (
            <>
              <div className="mb-5 flex flex-wrap items-end gap-3">
                {!focusMode && (
                  <fieldset>
                    <legend className="mb-2 font-semibold">Mode tampilan</legend>
                    <div className="flex gap-3">
                      {(["full", "card"] as const).map((value) => (
                        <label key={value} className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border-2 border-[var(--ba-border-ui)] px-4 py-2">
                          <input
                            type="radio"
                            name="reading-mode"
                            checked={mode === value}
                            onChange={() => {
                              setMode(value);
                              if (value === "full") setFocusMode(false);
                            }}
                            className="size-5 accent-[var(--ba-accent)]"
                          />
                          {value === "full" ? "Teks utuh" : "Kartu"}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                )}
                {focusMode ? (
                  <button
                    ref={returnButtonRef}
                    type="button"
                    onClick={() => {
                      setFocusMode(false);
                      focusButtonRef.current?.focus();
                    }}
                    className="min-h-11 rounded-lg border-2 border-[var(--ba-border-ui)] px-4 py-2 font-bold"
                  >
                    Kembali ke tampilan lengkap
                  </button>
                ) : mode === "card" ? (
                  <button
                    ref={focusButtonRef}
                    type="button"
                    onClick={() => setFocusMode(true)}
                    aria-pressed={focusMode}
                    className="min-h-11 rounded-lg border-2 border-[var(--ba-border-ui)] bg-[var(--ba-surface)] px-4 py-2 font-bold text-[var(--ba-fg)]"
                  >
                    Mode fokus
                  </button>
                ) : null}
              </div>

              <div ref={readingAreaRef} className="ba-reader max-w-none">
                {mode === "full" ? (
                  <BeforeAfterToggle
                    module={learningModule}
                    rulerEnabled={preferences.rulerEnabled}
                    lineHeight={lineHeight}
                  />
                ) : preferences.rulerEnabled ? (
                  <ReadingRuler lineHeight={lineHeight}>{reading}</ReadingRuler>
                ) : reading}
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-[var(--ba-border)] bg-[var(--ba-surface)] p-6">
              <h2 className="text-xl font-bold">Belum ada modul</h2>
              <p className="mt-2 text-[var(--ba-muted)]">Pilih materi contoh atau tempel teks sendiri untuk mulai membaca.</p>
            </div>
          )}
          <CognitiveLoadMeter load={learningModule?.load ?? null} />
        </section>

        {!focusMode && (
          <div className="order-2 min-w-0 md:order-1">
            <InputPanel activeSampleId={source.sampleId} onSelectSample={selectSample} onApply={applyText} />
          </div>
        )}
      </div>

      {!focusMode && (
        <div className="mx-auto w-full max-w-6xl px-4 pb-6 md:px-8 md:pb-8">
          <button
            type="button"
            aria-expanded={settingsOpen}
            aria-controls="pengaturan-tampilan"
            onClick={() => setSettingsOpen((open) => !open)}
            className="flex min-h-12 w-full items-center justify-between gap-4 rounded-xl border-2 border-[var(--ba-border-ui)] bg-[var(--ba-surface)] px-4 py-3 text-left font-bold"
          >
            Sesuaikan tampilan
            <span aria-hidden="true" className="text-2xl leading-none">{settingsOpen ? "−" : "+"}</span>
          </button>
          {settingsOpen && (
            <div
              id="pengaturan-tampilan"
              className="mt-4 rounded-2xl border border-[var(--ba-border)] bg-[var(--ba-surface)] p-6 md:p-8"
            >
              <ManualSettings preferences={preferences} onChange={updatePreference} onReset={resetProfile} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
