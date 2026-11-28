import { describe, expect, it } from "vitest";
import { selectVoice } from "@/lib/tts/voices";

function voice(name: string, lang: string): SpeechSynthesisVoice {
  return { default: false, lang, localService: true, name, voiceURI: name };
}

describe("selectVoice", () => {
  it("memprioritaskan id-ID daripada id lain dan nama Indonesian", () => {
    const indonesianName = voice("Indonesian voice", "en-US");
    const otherId = voice("Suara", "id");
    const exact = voice("Suara Indonesia", "id-id");
    expect(selectVoice([indonesianName, otherId, exact])).toBe(exact);
  });

  it("memilih id-* sebelum voice bernama Indonesian", () => {
    const named = voice("Bahasa Indonesia", "en-US");
    const indonesian = voice("Damayanti", "id");
    expect(selectVoice([named, indonesian])).toBe(indonesian);
  });

  it("dapat memilih voice bernama Indonesian atau Bahasa Indonesia", () => {
    const named = voice("Bahasa Indonesia", "en-US");
    expect(selectVoice([voice("English", "en-US"), named])).toBe(named);
  });

  it("tidak memilih ms-MY sebagai pengganti", () => {
    expect(selectVoice([voice("Melayu", "ms-MY"), voice("English", "en-US")])).toBeNull();
  });

  it("aman untuk daftar kosong", () => {
    expect(selectVoice([])).toBeNull();
  });
});
