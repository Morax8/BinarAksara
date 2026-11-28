"use client";

import { useRef, useState } from "react";
import SpeechControls from "@/components/tts/SpeechControls";
import WordSpan from "./WordSpan";
import { useSpeech } from "@/hooks/useSpeech";
import type { Module } from "@/types";

interface CardReaderProps {
  module: Module;
  rate?: number;
  onRateChange?: (rate: number) => void;
}

export default function CardReader({ module, rate = 1, onRateChange = () => undefined }: CardReaderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const status = `Kartu ${currentIndex + 1} dari ${module.cards.length}`;
  const card = module.cards[currentIndex];
  const speech = useSpeech({
    cards: [{ id: card.id, text: card.text, tokens: card.tokens.map((token) => token.text) }],
    contextKey: `${module.id}:${card.id}`,
    rate,
    onRateChange,
  });

  function goTo(index: number) {
    speech.stop();
    setCurrentIndex(index);
    titleRef.current?.focus();
  }

  return (
    <div>
      <article aria-labelledby="card-title" className="ba-reader w-full rounded-2xl border border-[var(--ba-border)] p-6 md:p-8">
        <p className="mb-3 text-sm font-bold">{status}</p>
        <h2 id="card-title" className="mb-3 text-[1.35em] font-bold">{module.title}</h2>
        <h3 ref={titleRef} tabIndex={-1} className="mb-5 font-semibold">Bagian {currentIndex + 1}</h3>
        <SpeechControls
          status={speech.status}
          mode={speech.mode}
          rate={rate}
          availability={speech.availability}
          onPlay={speech.play}
          onPause={speech.pause}
          onResume={speech.resume}
          onStop={speech.stop}
          onRateChange={speech.setRate}
        />
        <p><WordSpan tokens={card.tokens} activeTokenIndex={speech.activeTokenIndex} /></p>
      </article>
      <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">{status}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" disabled={currentIndex === 0} onClick={() => goTo(currentIndex - 1)} className="min-h-11 rounded-lg border-2 border-[var(--ba-border-ui)] px-4 py-2 font-bold disabled:cursor-not-allowed disabled:opacity-60">Sebelumnya</button>
        <button type="button" disabled={currentIndex === module.cards.length - 1} onClick={() => goTo(currentIndex + 1)} className="min-h-11 rounded-lg bg-[var(--ba-accent)] px-4 py-2 font-bold text-[var(--ba-on-accent)] disabled:cursor-not-allowed disabled:opacity-60">Selanjutnya</button>
      </div>
    </div>
  );
}
