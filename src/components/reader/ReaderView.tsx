import type { Module } from "@/types";

interface ReaderViewProps {
  module: Module;
}

export default function ReaderView({ module }: ReaderViewProps) {
  return (
    <article
      aria-labelledby="reader-title"
      className="ba-reader w-full rounded-2xl border border-[var(--ba-border)] p-6 md:p-8"
    >
      <h2 id="reader-title" className="mb-5 text-[1.35em] font-bold">{module.title}</h2>
      {module.cards.map((card) => (
        <p key={card.id} className="mb-5 last:mb-0">{card.text}</p>
      ))}
    </article>
  );
}
