"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { charIndexToTokenIndex, speak } from "@/lib/tts/speaker";
import { buildWordTimings } from "@/lib/tts/timingFallback";
import { getAvailability, selectVoice } from "@/lib/tts/voices";
import type { SpeechStatus } from "@/types";

export interface SpeechCard {
  id: string;
  text: string;
  tokens: string[];
}

interface UseSpeechOptions {
  cards: SpeechCard[];
  contextKey: string;
  rate: number;
  onRateChange: (rate: number) => void;
}

export function useSpeech({ cards, contextKey, rate, onRateChange }: UseSpeechOptions) {
  const [status, setStatus] = useState<SpeechStatus>("idle");
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  const [activeTokenIndex, setActiveTokenIndex] = useState<number | null>(null);
  const [mode, setMode] = useState<"boundary" | "timing">("boundary");
  const [availability, setAvailability] = useState(() => getAvailability());
  const cardsRef = useRef(cards);
  const rateRef = useRef(rate);
  const generationRef = useRef(0);
  const fallbackTimerRef = useRef<number | null>(null);
  const fallbackStateRef = useRef({ pending: false, deadline: 0, remainingMs: 0 });
  const wordTimerRef = useRef<number | null>(null);
  const timingRef = useRef({ cardIndex: 0, tokenIndex: 0, elapsedMs: 0, startedAt: 0 });
  const runTimingRef = useRef<((tokenIndex: number, elapsedMs: number) => void) | null>(null);
  const statusRef = useRef(status);

  useEffect(() => {
    cardsRef.current = cards;
    rateRef.current = rate;
  }, [cards, rate]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const clearTimers = useCallback(() => {
    if (fallbackTimerRef.current !== null) window.clearTimeout(fallbackTimerRef.current);
    if (wordTimerRef.current !== null) window.clearTimeout(wordTimerRef.current);
    fallbackTimerRef.current = null;
    wordTimerRef.current = null;
  }, []);

  const reset = useCallback(() => {
    generationRef.current += 1;
    clearTimers();
    fallbackStateRef.current.pending = false;
    runTimingRef.current = null;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setStatus("idle");
    setActiveCardIndex(null);
    setActiveTokenIndex(null);
    setMode("boundary");
  }, [clearTimers]);

  useEffect(() => {
    const timer = window.setTimeout(reset, 0);
    return () => {
      window.clearTimeout(timer);
      generationRef.current += 1;
      clearTimers();
      fallbackStateRef.current.pending = false;
      runTimingRef.current = null;
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, [contextKey, clearTimers, reset]);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const update = () => setAvailability(getAvailability());
    update();
    window.speechSynthesis.addEventListener("voiceschanged", update);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", update);
  }, []);

  function playCard(cardIndex: number, tokenIndex = 0, elapsedMs = 0) {
    const generation = generationRef.current;
    const card = cardsRef.current[cardIndex];
    if (!card) {
      reset();
      return;
    }
    clearTimers();
    fallbackStateRef.current.pending = false;
    setActiveCardIndex(cardIndex);
    setActiveTokenIndex(tokenIndex);
    setStatus("playing");
    setMode("boundary");
    const voice = selectVoice(window.speechSynthesis.getVoices());
    setAvailability(getAvailability());
    timingRef.current = { cardIndex, tokenIndex, elapsedMs, startedAt: 0 };

    function scheduleFallback(delayMs: number) {
      fallbackStateRef.current = {
        pending: true,
        deadline: performance.now() + delayMs,
        remainingMs: delayMs,
      };
      fallbackTimerRef.current = window.setTimeout(() => runTiming(0, 0), delayMs);
    }

    function runTiming(fromToken: number, fromElapsed: number) {
      if (generation !== generationRef.current || statusRef.current !== "playing") return;
      fallbackStateRef.current.pending = false;
      fallbackTimerRef.current = null;
      setMode("timing");
      const timings = buildWordTimings(card.tokens, rateRef.current);
      const startedAt = performance.now() - fromElapsed;
      timingRef.current = { cardIndex, tokenIndex: fromToken, elapsedMs: fromElapsed, startedAt };
      const schedule = (index: number) => {
        if (generation !== generationRef.current || statusRef.current !== "playing" || !timings[index]) return;
        setActiveTokenIndex(index);
        timingRef.current.tokenIndex = index;
        const delay = Math.max(0, startedAt + timings[index].endMs - performance.now());
        wordTimerRef.current = window.setTimeout(() => schedule(index + 1), delay);
      };
      schedule(fromToken);
    }
    runTimingRef.current = runTiming;

    const utterance = speak(card.text, {
      voice,
      rate: rateRef.current,
      onStart: () => {
        if (generation !== generationRef.current) return;
        scheduleFallback(1200);
      },
      onBoundary: (charIndex) => {
        if (generation !== generationRef.current || statusRef.current !== "playing") return;
        const index = charIndexToTokenIndex(card.tokens, charIndex);
        if (index === null) return;
        if (fallbackTimerRef.current !== null) {
          window.clearTimeout(fallbackTimerRef.current);
          fallbackTimerRef.current = null;
        }
        fallbackStateRef.current.pending = false;
        setMode("boundary");
        setActiveTokenIndex(index);
      },
      onEnd: () => {
        if (generation !== generationRef.current) return;
        clearTimers();
        if (cardIndex + 1 < cardsRef.current.length) playCard(cardIndex + 1);
        else reset();
      },
      onError: () => {
        if (generation !== generationRef.current) return;
        clearTimers();
        setStatus("error");
        setActiveTokenIndex(null);
      },
    });
    if (!utterance) setStatus("unavailable");
  }

  function play() {
    if (!getAvailability().supported || cardsRef.current.length === 0) return;
    reset();
    playCard(0);
  }

  const pause = useCallback(() => {
    if (statusRef.current !== "playing") return;
    statusRef.current = "paused";
    window.speechSynthesis.pause();
    if (fallbackStateRef.current.pending) {
      fallbackStateRef.current.remainingMs = Math.max(0, fallbackStateRef.current.deadline - performance.now());
    }
    if (wordTimerRef.current !== null) {
      const currentCard = cardsRef.current[timingRef.current.cardIndex];
      const currentTimings = currentCard ? buildWordTimings(currentCard.tokens, rateRef.current) : [];
      const currentTiming = currentTimings[timingRef.current.tokenIndex];
      const elapsed = performance.now() - timingRef.current.startedAt;
      timingRef.current.elapsedMs = currentTiming ? Math.min(elapsed, currentTiming.startMs) : elapsed;
    }
    clearTimers();
    setStatus("paused");
  }, [clearTimers]);

  function resume() {
    if (statusRef.current !== "paused") return;
    statusRef.current = "playing";
    window.speechSynthesis.resume();
    if (mode === "timing") {
      const { tokenIndex, elapsedMs } = timingRef.current;
      runTimingRef.current?.(tokenIndex, elapsedMs);
    } else if (fallbackStateRef.current.pending) {
      const { remainingMs } = fallbackStateRef.current;
      const deadline = performance.now() + remainingMs;
      fallbackStateRef.current.deadline = deadline;
      fallbackTimerRef.current = window.setTimeout(() => runTimingRef.current?.(0, 0), remainingMs);
    }
    setStatus("playing");
  }

  function setRate(nextRate: number) {
    reset();
    onRateChange(nextRate);
  }

  return { status, activeCardIndex, activeTokenIndex, mode, availability, play, pause, resume, stop: reset, setRate };
}
