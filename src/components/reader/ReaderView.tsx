"use client";

import SpeechControls from "@/components/tts/SpeechControls";
import WordSpan from "./WordSpan";
import { useSpeech } from "@/hooks/useSpeech";
import type { Module } from "@/types";

interface ReaderViewProps {
  module: Module;
  rate?: number;
  onRateChange?: (rate: number) => void;
}

export default function ReaderView({ module, rate = 1, onRateChange = () => undefined }: ReaderViewProps) {
  const speech = useSpeech({
    cards: module.cards.map((card) => ({ id: card.id, text: card.text, tokens: card.tokens.map((token) => token.text) })),
    contextKey: module.id,
    rate,
    onRateChange,
  });

  return (
    <article aria-labelledby="reader-title" className="ba-reader w-full rounded-2xl border border-[var(--ba-border)] p-6 md:p-8">
      <h2 id="reader-title" className="mb-5 text-[1.35em] font-bold">{module.title}</h2>
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
      {module.cards.map((card, cardIndex) => (
        <p key={card.id} className="mb-5 last:mb-0">
          <WordSpan tokens={card.tokens} activeTokenIndex={speech.activeCardIndex === cardIndex ? speech.activeTokenIndex : null} />
        </p>
      ))}
    </article>
  );
}
