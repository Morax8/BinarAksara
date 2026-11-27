"use client";

import { useRef, useState } from "react";
import type { Module } from "@/types";

interface CardReaderProps {
  module: Module;
}

export default function CardReader({ module }: CardReaderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const status = `Kartu ${currentIndex + 1} dari ${module.cards.length}`;
  const card = module.cards[currentIndex];

  function goTo(index: number) {
    setCurrentIndex(index);
    titleRef.current?.focus();
  }

  return (
    <div>
      <article aria-labelledby="card-title" className="ba-reader w-full rounded-2xl border border-[var(--ba-border)] p-6 md:p-8">
        <p className="mb-3 text-sm font-bold">{status}</p>
        <h2 id="card-title" className="mb-3 text-[1.35em] font-bold">{module.title}</h2>
        <h3 ref={titleRef} tabIndex={-1} className="mb-5 font-semibold">Bagian {currentIndex + 1}</h3>
        <p>{card.text}</p>
      </article>
      <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">{status}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={currentIndex === 0}
          onClick={() => goTo(currentIndex - 1)}
          className="min-h-11 rounded-lg border-2 border-[var(--ba-border-ui)] px-4 py-2 font-bold disabled:cursor-not-allowed disabled:opacity-60"
        >
          Sebelumnya
        </button>
        <button
          type="button"
          disabled={currentIndex === module.cards.length - 1}
          onClick={() => goTo(currentIndex + 1)}
          className="min-h-11 rounded-lg bg-[var(--ba-accent)] px-4 py-2 font-bold text-[var(--ba-on-accent)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
}
