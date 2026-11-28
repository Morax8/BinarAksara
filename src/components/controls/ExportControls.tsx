"use client";

export default function ExportControls() {
  return (
    <section aria-label="Cetak materi" className="mt-6">
      <button
        type="button"
        onClick={() => window.print()}
        className="min-h-11 rounded-lg border-2 border-[var(--ba-border-ui)] bg-[var(--ba-surface)] px-4 py-2 font-bold text-[var(--ba-fg)] hover:bg-[var(--ba-bg)]"
      >
        Cetak / Simpan PDF
      </button>
      <p className="mt-2 text-sm text-[var(--ba-muted)]">
        Mencetak seluruh materi adaptif dengan pengaturan baca aktif, bukan hanya kartu yang terlihat. Pilih &quot;Simpan sebagai PDF&quot; pada dialog browser untuk menyimpan.
      </p>
    </section>
  );
}
