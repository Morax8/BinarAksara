"use client";

import { useMemo } from "react";
import { buildModule } from "@/lib/nlp";
import type { Module } from "@/types";

export function useModule(sourceText: string): Module | null {
  return useMemo(() => buildModule(sourceText), [sourceText]);
}
