export function charIndexToTokenIndex(
  tokens: string[],
  charIndex: number,
): number | null {
  if (!Number.isInteger(charIndex) || charIndex < 0) return null;
  let offset = 0;
  for (let index = 0; index < tokens.length; index += 1) {
    if (charIndex >= offset && charIndex < offset + tokens[index].length) {
      return index;
    }
    offset += tokens[index].length + 1;
  }
  return null;
}

export interface SpeakOptions {
  voice: SpeechSynthesisVoice | null;
  rate: number;
  onStart: () => void;
  onBoundary: (charIndex: number) => void;
  onEnd: () => void;
  onError: () => void;
}

export function speak(text: string, options: SpeakOptions): SpeechSynthesisUtterance | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = options.rate;
  utterance.lang = options.voice?.lang ?? "id-ID";
  if (options.voice) utterance.voice = options.voice;
  utterance.onstart = options.onStart;
  utterance.onboundary = (event) => options.onBoundary(event.charIndex);
  utterance.onend = options.onEnd;
  utterance.onerror = options.onError;
  window.speechSynthesis.speak(utterance);
  return utterance;
}
