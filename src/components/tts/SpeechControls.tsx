"use client";

interface SpeechControlsProps {
  status: "idle" | "playing" | "paused" | "unavailable" | "error";
  mode: "boundary" | "timing";
  rate: number;
  availability: { supported: boolean; message: string };
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onRateChange: (rate: number) => void;
}

const buttonClass = "min-h-11 min-w-11 rounded-lg border-2 border-[var(--ba-border-ui)] px-4 py-2 font-bold disabled:cursor-not-allowed disabled:opacity-60";

export default function SpeechControls({
  status,
  mode,
  rate,
  availability,
  onPlay,
  onPause,
  onResume,
  onStop,
  onRateChange,
}: SpeechControlsProps) {
  return (
    <section aria-label="Kontrol text-to-speech" className="mb-5 rounded-xl border border-[var(--ba-border)] bg-[var(--ba-surface)] p-4 text-base">
      <div className="flex flex-wrap gap-3">
        {status === "playing" ? (
          <button type="button" onClick={onPause} disabled={!availability.supported} className={buttonClass}>Jeda</button>
        ) : (
          <button
            type="button"
            onClick={status === "paused" ? onResume : onPlay}
            disabled={!availability.supported}
            className={buttonClass}
          >
            {status === "paused" ? "Lanjutkan" : "Putar"}
          </button>
        )}
        <button
          type="button"
          onClick={onStop}
          disabled={status === "idle" || status === "unavailable"}
          className={buttonClass}
        >
          Berhenti
        </button>
      </div>
      <div className="mt-4">
        <label htmlFor="speech-rate" className="mb-2 block font-semibold">Kecepatan baca</label>
        <div className="flex min-h-11 items-center gap-3">
          <input
            id="speech-rate"
            type="range"
            min="0.75"
            max="1.5"
            step="0.05"
            value={rate}
            aria-valuetext={`${rate.toLocaleString("id-ID")} kali`}
            onChange={(event) => onRateChange(Number(event.target.value))}
            className="min-h-11 flex-1 accent-[var(--ba-accent)]"
          />
          <span className="min-w-16 font-semibold">{rate.toLocaleString("id-ID")}×</span>
        </div>
      </div>
      <div className="mt-3 text-sm">
        <p>{availability.message}</p>
        {availability.supported && status !== "idle" && (
          <p className="mt-1">{mode === "boundary" ? "Sorotan mengikuti batas kata browser" : "Sorotan memakai estimasi durasi"}</p>
        )}
        {status === "error" && <p className="mt-1">Pemutaran terhenti karena kesalahan browser. Silakan coba Putar kembali.</p>}
      </div>
    </section>
  );
}
