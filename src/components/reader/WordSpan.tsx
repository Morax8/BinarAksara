"use client";

interface WordSpanProps {
  tokens: { text: string }[];
  activeTokenIndex: number | null;
}

export default function WordSpan({ tokens, activeTokenIndex }: WordSpanProps) {
  if (activeTokenIndex === null) return <>{tokens.map((token) => token.text).join(" ")}</>;
  return (
    <>
      {tokens.map((token, index) => (
        <span key={index}>
          <span className={activeTokenIndex === index ? "ba-word-active" : undefined}>
            {token.text}
          </span>
          {index < tokens.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}
