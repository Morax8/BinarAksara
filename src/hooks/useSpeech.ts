import type { SpeechStatus } from "@/types";

export function useSpeech(): SpeechStatus {
  // TODO(Hooks): kelola status text-to-speech
  return "idle";
}
