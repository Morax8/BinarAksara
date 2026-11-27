"use client";

import { SAMPLES } from "@/data/samples";

interface SampleSelectorProps {
  activeSampleId: string | null;
  onSelect: (id: string) => void;
}

export default function SampleSelector({ activeSampleId, onSelect }: SampleSelectorProps) {
  return (
    <div className="grid gap-3" aria-label="Pilihan materi contoh">
      {SAMPLES.map((sample) => (
        <button
          key={sample.id}
          type="button"
          aria-pressed={activeSampleId === sample.id}
          onClick={() => onSelect(sample.id)}
          className="min-h-11 rounded-lg border-2 border-[var(--ba-border-ui)] bg-[var(--ba-surface)] p-3 text-left aria-pressed:border-[var(--ba-accent)]"
        >
          <span className="block font-bold">{sample.title}</span>
          <span className="mt-1 block text-sm text-[var(--ba-muted)]">{sample.subject}</span>
        </button>
      ))}
    </div>
  );
}
