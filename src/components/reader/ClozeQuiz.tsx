"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Module } from "@/types";
import { createClozeItems } from "@/lib/nlp/cloze";

interface ClozeQuizProps {
  module: Module;
}

export default function ClozeQuiz({ module }: ClozeQuizProps) {
  const [shuffleRound, setShuffleRound] = useState(0);
  const seed = shuffleRound === 0 ? module.id : `${module.id}-acak-${shuffleRound}`;
  const items = useMemo(() => createClozeItems(module, seed), [module, seed]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const item = items[index];

  useEffect(() => {
    if (index > 0 && !finished) headingRef.current?.focus();
  }, [index, finished]);

  function reset(round = 0) {
    setShuffleRound(round);
    setIndex(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
  }

  function nextQuestion() {
    if (index === items.length - 1) setFinished(true);
    else {
      setIndex((current) => current + 1);
      setSelected(null);
      setAnswered(false);
    }
  }

  return (
    <section aria-labelledby="cloze-quiz-title" className="mt-6 rounded-2xl border border-[var(--ba-border)] bg-[var(--ba-surface)] p-5">
      <h2 id="cloze-quiz-title" className="text-xl font-bold">Latih pemahaman</h2>
      {!item ? (
        <p className="mt-3 text-[var(--ba-muted)]">Materi ini belum memiliki cukup kandidat untuk membuat latihan rumpang dengan empat pilihan yang layak.</p>
      ) : finished ? (
        <div className="mt-4">
          <p role="status" className="font-semibold">Kuis selesai. Skor: {score}/{items.length} benar.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => reset()} className="min-h-11 rounded-lg border-2 border-[var(--ba-border-ui)] px-4 py-2 font-bold">Ulangi kuis</button>
            <button type="button" onClick={() => reset(shuffleRound + 1)} className="min-h-11 rounded-lg border-2 border-[var(--ba-border-ui)] px-4 py-2 font-bold">Acak ulang</button>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <p className="text-sm font-semibold text-[var(--ba-muted)]">Soal {index + 1} dari {items.length}</p>
          <h3 ref={headingRef} tabIndex={-1} className="mt-2 text-lg font-bold">Lengkapi kalimat berikut</h3>
          <fieldset className="mt-3" disabled={answered}>
            <legend className="mb-4 leading-relaxed">{item.prompt}</legend>
            <div className="grid gap-2">
              {item.options.map((option) => (
                <label key={option} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border-2 border-[var(--ba-border-ui)] px-4 py-2">
                  <input
                    type="radio"
                    name={`cloze-${item.id}`}
                    value={option}
                    checked={selected === option}
                    disabled={answered}
                    onChange={() => setSelected(option)}
                    className="size-5 shrink-0 accent-[var(--ba-accent)]"
                  />
                  {option}
                </label>
              ))}
            </div>
          </fieldset>
          {!answered ? (
            <button
              type="button"
              disabled={selected === null}
              onClick={() => {
                setAnswered(true);
                if (selected === item.answer) setScore((current) => current + 1);
              }}
              className="mt-4 min-h-11 rounded-lg border-2 border-[var(--ba-border-ui)] bg-[var(--ba-accent)] px-4 py-2 font-bold text-[var(--ba-on-accent)] disabled:opacity-60"
            >Jawab</button>
          ) : (
            <>
              <div role="status" className="mt-4 leading-relaxed">
                <p className="font-bold"><span aria-hidden="true">{selected === item.answer ? "✓" : "✗"}</span> {selected === item.answer ? "Benar" : "Belum tepat"}</p>
                {selected !== item.answer && (
                  <>
                    <p className="mt-2">Jawaban yang benar: <strong>{item.answer}</strong></p>
                    <p className="mt-2">Kalimat lengkap: {item.prompt.replace("_____", item.answer)}</p>
                  </>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button type="button" onClick={nextQuestion} className="min-h-11 rounded-lg border-2 border-[var(--ba-border-ui)] bg-[var(--ba-accent)] px-4 py-2 font-bold text-[var(--ba-on-accent)]">Soal berikutnya</button>
                <button type="button" onClick={() => reset(shuffleRound + 1)} className="min-h-11 rounded-lg border-2 border-[var(--ba-border-ui)] px-4 py-2 font-bold">Acak ulang</button>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
