export interface VoiceAvailability {
  supported: boolean;
  hasIndonesianVoice: boolean;
  message: string;
}

export function selectVoice(
  voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice | null {
  return (
    voices.find((voice) => voice.lang.toLowerCase() === "id-id") ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith("id")) ??
    voices.find((voice) => /indonesian|bahasa indonesia/iu.test(voice.name)) ??
    null
  );
}

export function getAvailability(): VoiceAvailability {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return {
      supported: false,
      hasIndonesianVoice: false,
      message: "Text-to-speech tidak tersedia di browser ini. Coba Chrome atau Edge, atau lanjutkan membaca tanpa suara.",
    };
  }
  const voice = selectVoice(window.speechSynthesis.getVoices());
  return {
    supported: true,
    hasIndonesianVoice: voice !== null,
    message: voice
      ? `Menggunakan suara Indonesia: ${voice.name} (${voice.lang}).`
      : "Suara Indonesia tidak ditemukan; menggunakan suara bawaan sistem",
  };
}

export function getVoices(): SpeechSynthesisVoice[] {
  return typeof window === "undefined" || !("speechSynthesis" in window)
    ? []
    : window.speechSynthesis.getVoices();
}
