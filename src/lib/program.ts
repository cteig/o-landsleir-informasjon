import { ProgramDay } from "@/types/activity";
import { fetchProgramFromSheets } from "./sheets";
import { program as fallbackProgram } from "@/data/activities";

export type ProgramResult = {
  days: ProgramDay[];
  updatedAt: string;
};

export async function fetchProgram(): Promise<ProgramResult> {
  const updatedAt = new Date().toISOString();
  try {
    const days = await fetchProgramFromSheets();
    if (days.length > 0) return { days, updatedAt };
  } catch {
    // Sheets unavailable — use fallback
  }
  return { days: fallbackProgram, updatedAt };
}

export async function fetchDayById(
  id: string,
): Promise<{ day: ProgramDay | undefined; updatedAt: string }> {
  const { days, updatedAt } = await fetchProgram();
  return { day: days.find((d) => d.id === id), updatedAt };
}
