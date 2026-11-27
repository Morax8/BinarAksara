// Daftar lokal ini sengaja terbuka untuk diperluas tanpa dependency eksternal.
export const ACADEMIC_ABBREVIATIONS = [
  "Prof",
  "Dr",
  "dr",
  "Ir",
  "H",
  "Hj",
  "M.Kom",
  "S.Kom",
  "M.T",
  "S.T",
  "dkk",
  "dll",
  "dsb",
  "dst",
  "No",
] as const;

const ABBREVIATION = new RegExp(
  `(?:${ACADEMIC_ABBREVIATIONS.join("|").replace(/\./g, "\\.")})\\.$`,
);

/** Memecah kalimat tanpa mengubah tanda baca atau isi teks. */
export function splitSentences(text: string): string[] {
  const normalized = text.replace(/\r\n?/g, "\n").trim();
  if (!normalized) return [];

  const sentences: string[] = [];
  let start = 0;
  let position = 0;

  const push = (end: number) => {
    const sentence = normalized.slice(start, end).trim();
    if (sentence) sentences.push(sentence);
    start = end;
  };

  while (position < normalized.length) {
    const character = normalized[position];
    if (character === "\n") {
      let end = position + 1;
      while (normalized[end] === "\n") end += 1;
      if (end - position >= 2) {
        push(position);
        position = end;
        continue;
      }
    }

    if (character === "." || character === "?" || character === "!" || character === "…") {
      let end = position + 1;
      if (character === ".") {
        while (normalized[end] === ".") end += 1;
        const prefix = normalized.slice(0, position + 1);
        const word = prefix.match(/([\p{L}][\p{L}.]*)$/u)?.[1];
        const previous = normalized[position - 1];
        const next = normalized[end];
        if (/\d/.test(previous) && /\d/.test(next)) {
          position = end;
          continue;
        }
        if (word && ABBREVIATION.test(word)) {
          position = end;
          continue;
        }
      }

      // Kutipan atau kurung penutup tetap menjadi bagian kalimat.
      while (normalized[end] && /["'”’)\]]/.test(normalized[end])) end += 1;
      let following = end;
      while (normalized[following] === " ") following += 1;
      if (
        following > position + 1 &&
        normalized[following] !== undefined &&
        (normalized[following] === "\n" ||
          /["'“‘\p{Lu}]/u.test(normalized[following]))
      ) {
        push(end);
        position = following;
        continue;
      }
      position = end;
      continue;
    }
    position += 1;
  }

  push(normalized.length);
  return sentences;
}
