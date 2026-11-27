"use client";

import { useState } from "react";
import ReaderView from "@/components/reader/ReaderView";
import ReadingRuler from "@/components/reader/ReadingRuler";
import type { Module } from "@/types";

interface BeforeAfterToggleProps {
  module: Module;
  rulerEnabled?: boolean;
  lineHeight?: number;
}

export default function BeforeAfterToggle({ module, rulerEnabled = false, lineHeight = 28.8 }: BeforeAfterToggleProps) {
  const [view, setView] = useState<"original" | "adaptive">("adaptive");

  return (
    <div>
      <div role="radiogroup" aria-label="Perbandingan tampilan" className="mb-5 flex flex-wrap gap-3">
        {(["original", "adaptive"] as const).map((option) => (
          <label key={option} className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border-2 border-[var(--ba-border-ui)] px-4 py-2 has-checked:border-[var(--ba-accent)]">
            <input
              type="radio"
              name="before-after"
              value={option}
              checked={view === option}
              onChange={() => setView(option)}
              className="size-5 accent-[var(--ba-accent)]"
            />
            {option === "original" ? "Teks asli" : "Tampilan adaptif"}
          </label>
        ))}
      </div>
      {view === "original" ? (
        <article aria-labelledby="original-title" className="w-full rounded-2xl border border-[var(--ba-border)] bg-white p-6 text-[#0f172a] md:p-8">
          <h2 id="original-title" className="mb-5 text-2xl font-bold">{module.title}</h2>
          <div
            data-testid="original-text"
            style={{
              whiteSpace: "pre-wrap",
              fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontSize: "18px",
              lineHeight: 1.6,
              letterSpacing: "0em",
              wordSpacing: "0em",
              maxWidth: "65ch",
            }}
          >
            {module.sourceText}
          </div>
        </article>
      ) : rulerEnabled ? (
        <ReadingRuler lineHeight={lineHeight}>
          <ReaderView module={module} />
        </ReadingRuler>
      ) : (
        <ReaderView module={module} />
      )}
    </div>
  );
}
