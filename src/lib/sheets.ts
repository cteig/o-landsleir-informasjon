import { Activity, ProgramDay } from "@/types/activity";

const SHEET_ID = "1wRO77uh6gk5X0ERSQ4nt9Q_qXmb2DBR7hFb2JiKmY88";
const GID = "667582302";
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${GID}`;
const FETCH_TIMEOUT_MS = 3000;

/**
 * Expected CSV columns (order matters):
 * id, date, label, title, description, url, sub_items, start_time, end_time, location, map_url
 */

/** Parse a single CSV line, handling quoted fields with commas inside. */
export function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        fields.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
  }
  fields.push(current.trim());
  return fields;
}

/** Fetch CSV from Google Sheets, parse rows, group by day into ProgramDay[]. */
export async function fetchProgramFromSheets(): Promise<ProgramDay[]> {
  const response = await fetch(CSV_URL, {
    cache: "no-store",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Google Sheets returned ${response.status}`);
  }

  const text = await response.text();
  const lines = text.split("\n").filter((line) => line.trim() !== "");

  const dataLines = lines.slice(1);

  const dayMap = new Map<string, { date: string; label: string; activities: Activity[] }>();
  const dayOrder: string[] = [];

  for (const line of dataLines) {
    const cols = parseCSVLine(line);
    const [
      id,
      date,
      label,
      title,
      description,
      url,
      subItemsRaw,
      startTime,
      endTime,
      location,
      mapUrl,
    ] = cols;

    if (!id || !title) continue;

    const activity: Activity = {
      title,
      ...(description && { description }),
      ...(url && { url }),
      ...(subItemsRaw && {
        subItems: subItemsRaw
          .split(";")
          .map((s) => s.trim())
          .filter(Boolean),
      }),
      ...(startTime && { startTime }),
      ...(endTime && { endTime }),
      ...(location && { location }),
      ...(mapUrl && { mapUrl }),
    };

    if (!dayMap.has(id)) {
      dayMap.set(id, { date, label, activities: [] });
      dayOrder.push(id);
    }
    dayMap.get(id)!.activities.push(activity);
  }

  return dayOrder.map((id) => {
    const day = dayMap.get(id)!;
    return { id, date: day.date, label: day.label, activities: day.activities };
  });
}
