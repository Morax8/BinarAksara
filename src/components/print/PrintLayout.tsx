import type { Module } from "@/types";

interface PrintLayoutProps {
  module: Module;
  title: string;
  profileLabel: string;
}

export default function PrintLayout({ module, title, profileLabel }: PrintLayoutProps) {
  return (
    <article className="print-layout" data-testid="print-layout" aria-label="Materi untuk dicetak">
      <header>
        <p className="print-brand">BinarAksara</p>
        <h1>{title}</h1>
        <p>Profil: {profileLabel}</p>
      </header>
      <div>
        {module.cards.map((card, index) => (
          <section key={card.id} data-print-card className="print-card">
            <h2>Bagian {index + 1}</h2>
            <p>{card.text}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
