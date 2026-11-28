export interface WordTiming {
  startMs: number;
  endMs: number;
}

function clampRate(rate: number): number {
  return Number.isFinite(rate) ? Math.min(2, Math.max(0.5, rate)) : 1;
}

export function estimateWordDurationMs(token: string, rate: number): number {
  const letters = token.match(/[\p{L}\p{N}]/gu)?.length ?? 0;
  let pauseMs = 0;
  if (/[.!?…]/u.test(token)) pauseMs = 280;
  else if (/[;:]/u.test(token)) pauseMs = 200;
  else if (/[,]/u.test(token)) pauseMs = 140;
  else if (/[\)\]\}"”’]/u.test(token)) pauseMs = 60;
  return (letters * 55 + 80 + pauseMs) / clampRate(rate);
}

export function buildWordTimings(tokens: string[], rate: number): WordTiming[] {
  let startMs = 0;
  return tokens.map((token) => {
    const endMs = startMs + estimateWordDurationMs(token, rate);
    const timing = { startMs, endMs };
    startMs = endMs;
    return timing;
  });
}

export function estimateSpeechDuration(text: string, rate: number): number {
  const tokens = text.trim() ? text.trim().split(/\s+/u) : [];
  const timings = buildWordTimings(tokens, rate);
  return timings.at(-1)?.endMs ?? 0;
}
