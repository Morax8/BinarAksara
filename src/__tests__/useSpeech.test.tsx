import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useSpeech } from "@/hooks/useSpeech";

const cards = [{ id: "card-1", text: "Satu dua tiga", tokens: ["Satu", "dua", "tiga"] }];

describe("useSpeech pause/resume", () => {
  let speakMock: ReturnType<typeof vi.fn>;
  let cancelMock: ReturnType<typeof vi.fn>;
  let pauseMock: ReturnType<typeof vi.fn>;
  let resumeMock: ReturnType<typeof vi.fn>;
  let utterances: Array<{
    onstart: null | (() => void);
    onboundary: null | ((event: { charIndex: number }) => void);
    onend: null | (() => void);
    onerror: null | (() => void);
  }>;

  beforeEach(() => {
    vi.useFakeTimers();
    utterances = [];
    speakMock = vi.fn();
    cancelMock = vi.fn();
    pauseMock = vi.fn();
    resumeMock = vi.fn();

    class MockUtterance {
      onstart = null;
      onboundary = null;
      onend = null;
      onerror = null;
      rate = 1;
      lang = "";
      voice = null;

      constructor(public text: string) {
        utterances.push(this);
      }
    }

    vi.stubGlobal("SpeechSynthesisUtterance", MockUtterance);
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        speak: speakMock,
        cancel: cancelMock,
        pause: pauseMock,
        resume: resumeMock,
        getVoices: () => [],
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      },
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  function renderSpeech() {
    return renderHook(() => useSpeech({ cards, contextKey: "test", rate: 1, onRateChange: vi.fn() }));
  }

  it("membersihkan fallback saat pause sebelum 1200ms sehingga highlight dan timer tidak berjalan", () => {
    const { result } = renderSpeech();
    act(() => {
      vi.advanceTimersByTime(0);
      result.current.play();
    });
    act(() => {
      utterances[0].onstart?.();
      vi.advanceTimersByTime(500);
      result.current.pause();
    });
    const highlightedToken = result.current.activeTokenIndex;

    act(() => vi.advanceTimersByTime(5000));

    expect(result.current.status).toBe("paused");
    expect(result.current.mode).toBe("boundary");
    expect(result.current.activeTokenIndex).toBe(highlightedToken);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("resume mode timing hanya melanjutkan audio dan highlight tanpa utterance atau cancel baru", () => {
    const { result } = renderSpeech();
    act(() => {
      vi.advanceTimersByTime(0);
      result.current.play();
    });
    act(() => {
      utterances[0].onstart?.();
      vi.advanceTimersByTime(1200);
      vi.advanceTimersByTime(100);
      result.current.pause();
    });
    const cancelCallsBeforeResume = cancelMock.mock.calls.length;
    const pausedToken = result.current.activeTokenIndex;

    act(() => result.current.resume());

    expect(result.current.status).toBe("playing");
    expect(result.current.mode).toBe("timing");
    expect(result.current.activeTokenIndex).toBe(pausedToken);
    expect(speakMock).toHaveBeenCalledTimes(1);
    expect(cancelMock).toHaveBeenCalledTimes(cancelCallsBeforeResume);
    expect(resumeMock).toHaveBeenCalledTimes(1);
  });

  it("menjadwalkan ulang fallback dengan sisa waktu setelah resume tanpa memulai audio baru", () => {
    const { result } = renderSpeech();
    act(() => {
      vi.advanceTimersByTime(0);
      result.current.play();
    });
    act(() => {
      utterances[0].onstart?.();
      vi.advanceTimersByTime(500);
      result.current.pause();
    });
    const cancelCallsBeforeResume = cancelMock.mock.calls.length;
    const highlightedToken = result.current.activeTokenIndex;

    act(() => vi.advanceTimersByTime(5000));
    expect(result.current.activeTokenIndex).toBe(highlightedToken);
    expect(result.current.mode).toBe("boundary");

    act(() => result.current.resume());
    expect(result.current.mode).toBe("boundary");
    expect(speakMock).toHaveBeenCalledTimes(1);
    expect(cancelMock).toHaveBeenCalledTimes(cancelCallsBeforeResume);

    act(() => vi.advanceTimersByTime(699));
    expect(result.current.mode).toBe("boundary");
    act(() => vi.advanceTimersByTime(1));
    expect(result.current.mode).toBe("timing");
    expect(speakMock).toHaveBeenCalledTimes(1);
  });
});
