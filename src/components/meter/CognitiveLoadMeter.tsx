"use client";

import type { LoadScore } from "@/types";

interface CognitiveLoadMeterProps {
  load: { before: LoadScore; after: LoadScore } | null;
}

function FactorList({ score }: { score: LoadScore }) {
  return (
    <dl className="mt-3 grid gap-2 text-sm">
      <div className="flex justify-between gap-3">
        <dt>Rata-rata kata per kalimat</dt>
        <dd className="font-bold">{score.factors.avgSentenceWords.toFixed(1)}</dd>
      </div>
      <div className="flex justify-between gap-3">
        <dt>Rasio kata panjang</dt>
        <dd className="font-bold">{(score.factors.longWordRatio * 100).toFixed(1)}%</dd>
      </div>
      <div className="flex justify-between gap-3">
        <dt>Rata-rata klausa per kalimat</dt>
        <dd className="font-bold">{score.factors.avgClausesPerSentence.toFixed(1)}</dd>
      </div>
    </dl>
  );
}

export default function CognitiveLoadMeter({ load }: CognitiveLoadMeterProps) {
  if (!load) return null;

  return (
    <section aria-labelledby="load-meter-title" className="mt-6 rounded-2xl border border-[var(--ba-border)] bg-[var(--ba-surface)] p-5">
      <h2 id="load-meter-title" className="text-xl font-bold">Perkiraan beban kognitif</h2>
      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        <div>
          <h3 className="font-bold">Sebelum</h3>
          <p className="mt-1"><strong className="text-2xl">{load.before.value}</strong> · {load.before.label}</p>
          <FactorList score={load.before} />
        </div>
        <div>
          <h3 className="font-bold">Sesudah per kartu</h3>
          <p className="mt-1"><strong className="text-2xl">{load.after.value}</strong> · {load.after.label}</p>
          <FactorList score={load.after} />
        </div>
      </div>
      <p className="mt-5 text-sm text-[var(--ba-muted)]">
        Heuristik transparan berdasarkan struktur teks, bukan diagnosis atau pengukuran klinis. After dihitung per sajian kartu; penurunan kecil wajar untuk teks yang kalimatnya sudah sederhana.
      </p>
    </section>
  );
}
