import { ProgramDay } from "@/types/activity";
import { fetchProgramFromSheets } from "./sheets";
import { program as fallbackProgram } from "@/data/activities";

export async function fetchProgram(): Promise<ProgramDay[]> {
  try {
    const days = await fetchProgramFromSheets();
    if (days.length > 0) return days;
  } catch {
    // Sheets unavailable — use fallback
  }
  return fallbackProgram;
}

export async function fetchDayById(id: string): Promise<ProgramDay | undefined> {
  const days = await fetchProgram();
  return days.find((day) => day.id === id);
}
