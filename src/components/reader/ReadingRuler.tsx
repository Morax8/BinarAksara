"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface ReadingRulerProps {
  lineHeight: number;
  containerHeight?: number;
  children?: ReactNode;
}

export default function ReadingRuler({ lineHeight, containerHeight, children }: ReadingRulerProps) {
  const [lines, setLines] = useState(1);
  const [top, setTop] = useState(0);
  const [measuredHeight, setMeasuredHeight] = useState(0);
  const areaRef = useRef<HTMLDivElement>(null);
  const height = lines * lineHeight + 4;
  const availableHeight = containerHeight ?? measuredHeight;
  const maximumTop = Math.max(0, availableHeight - height);
  const boundedTop = Math.min(top, maximumTop);

  useEffect(() => {
    const area = areaRef.current;
    if (!area) return;
    const measure = () => setMeasuredHeight(area.clientHeight);
    measure();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(area);
    return () => observer.disconnect();
  }, [children]);

  function move(direction: -1 | 1) {
    setTop((current) => Math.min(maximumTop, Math.max(0, current + direction * lineHeight)));
  }

  return (
    <div className="mt-5">
      <fieldset>
        <legend className="font-semibold">Tinggi garis bantu baca</legend>
        <div className="mt-2 flex flex-wrap gap-3">
          {[1, 2, 3].map((value) => (
            <label key={value} className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border-2 border-[var(--ba-border-ui)] px-3 py-2">
              <input
                type="radio"
                name="ruler-height"
                checked={lines === value}
                onChange={() => setLines(value)}
                className="size-5 accent-[var(--ba-accent)]"
              />
              {value} baris
            </label>
          ))}
        </div>
      </fieldset>
      <div className="mt-3 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={boundedTop === 0}
          onClick={() => move(-1)}
          className="min-h-11 rounded-lg border-2 border-[var(--ba-border-ui)] px-4 py-2 font-bold disabled:opacity-60"
        >
          Naikkan pita
        </button>
        <button
          type="button"
          disabled={boundedTop >= maximumTop}
          onClick={() => move(1)}
          className="min-h-11 rounded-lg border-2 border-[var(--ba-border-ui)] px-4 py-2 font-bold disabled:opacity-60"
        >
          Turunkan pita
        </button>
      </div>
      <div
        ref={areaRef}
        className="relative mt-3"
        onPointerMove={(event) => {
          if (event.pointerType === "touch") return;
          const bounds = event.currentTarget.getBoundingClientRect();
          const nextTop = event.clientY - bounds.top - height / 2;
          setTop(Math.min(maximumTop, Math.max(0, nextTop)));
        }}
      >
        {children}
        <div
          data-testid="reading-ruler"
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 border-y-2 border-[var(--ba-accent)] bg-[color-mix(in_srgb,var(--ba-accent)_12%,transparent)]"
          style={{ top: boundedTop, height }}
        />
      </div>
    </div>
  );
}
