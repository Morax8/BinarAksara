"use client";

import { useRef, useState } from "react";
import SampleSelector from "./SampleSelector";

interface InputPanelProps {
  activeSampleId: string | null;
  onSelectSample: (id: string) => void;
  onApply: (text: string, title: string) => void;
}

export default function InputPanel({ activeSampleId, onSelectSample, onApply }: InputPanelProps) {
  const [activeTab, setActiveTab] = useState<"samples" | "paste">("samples");
  const [text, setText] = useState("");
  const [message, setMessage] = useState("Belum ada materi yang diterapkan.");
  const sampleTabRef = useRef<HTMLButtonElement>(null);
  const pasteTabRef = useRef<HTMLButtonElement>(null);

  function selectTab(tab: "samples" | "paste") {
    setActiveTab(tab);
    (tab === "samples" ? sampleTabRef : pasteTabRef).current?.focus();
  }

  function applyText() {
    if (!text.trim()) {
      setMessage("Masukkan teks materi sebelum menerapkannya.");
      return;
    }
    onApply(text, "Materi Belajar");
    setMessage("Materi berhasil diterapkan.");
  }

  return (
    <section aria-labelledby="input-panel-title" className="rounded-2xl border border-[var(--ba-border)] bg-[var(--ba-surface)] p-5">
      <h2 id="input-panel-title" className="text-xl font-bold">Pilih materi</h2>
      <div role="tablist" aria-label="Sumber materi" className="mt-4 flex flex-wrap gap-3">
        <button
          ref={sampleTabRef}
          id="samples-tab"
          type="button"
          role="tab"
          aria-selected={activeTab === "samples"}
          aria-controls="samples-panel"
          tabIndex={activeTab === "samples" ? 0 : -1}
          onClick={() => setActiveTab("samples")}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
              event.preventDefault();
              selectTab("paste");
            }
          }}
          className="min-h-11 rounded-lg border-2 border-[var(--ba-border-ui)] px-4 py-2 font-bold aria-selected:bg-[var(--ba-accent)] aria-selected:text-[var(--ba-on-accent)]"
        >
          Materi contoh
        </button>
        <button
          ref={pasteTabRef}
          id="paste-tab"
          type="button"
          role="tab"
          aria-selected={activeTab === "paste"}
          aria-controls="paste-panel"
          tabIndex={activeTab === "paste" ? 0 : -1}
          onClick={() => setActiveTab("paste")}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
              event.preventDefault();
              selectTab("samples");
            }
          }}
          className="min-h-11 rounded-lg border-2 border-[var(--ba-border-ui)] px-4 py-2 font-bold aria-selected:bg-[var(--ba-accent)] aria-selected:text-[var(--ba-on-accent)]"
        >
          Tempel teks sendiri
        </button>
      </div>

      {activeTab === "samples" ? (
        <div id="samples-panel" role="tabpanel" aria-labelledby="samples-tab" className="mt-5">
          <SampleSelector activeSampleId={activeSampleId} onSelect={onSelectSample} />
        </div>
      ) : (
        <div id="paste-panel" role="tabpanel" aria-labelledby="paste-tab" className="mt-5">
          <label htmlFor="source-text" className="block font-semibold">Teks materi</label>
          <textarea
            id="source-text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={8}
            className="mt-2 w-full rounded-lg border-2 border-[var(--ba-border-ui)] bg-[var(--ba-bg)] p-3 text-[var(--ba-fg)]"
          />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-[var(--ba-muted)]">{text.length} karakter</span>
            <button
              type="button"
              onClick={applyText}
              className="min-h-11 rounded-lg bg-[var(--ba-accent)] px-4 py-2 font-bold text-[var(--ba-on-accent)]"
            >
              Terapkan materi
            </button>
          </div>
        </div>
      )}
      <p
        role={message.startsWith("Masukkan") ? "alert" : "status"}
        aria-live="polite"
        className="mt-4 text-sm text-[var(--ba-muted)]"
      >
        {message}
      </p>
    </section>
  );
}
