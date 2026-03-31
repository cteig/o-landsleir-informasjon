import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchProgram } from "../program";
import { program as fallbackProgram } from "@/data/activities";

describe("fetchProgram", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns fallback data when fetch fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network error")));

    const { days } = await fetchProgram();
    expect(days).toEqual(fallbackProgram);
  });

  it("returns fallback data when response is not ok", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 401 }));

    const { days } = await fetchProgram();
    expect(days).toEqual(fallbackProgram);
  });

  it("parses CSV response into ProgramDay array", async () => {
    const csvData = [
      '"id","date","label","title","description","url","sub_items","start_time","end_time","location","map_url"',
      '"dag1","1. aug","Mandag","Aktivitet A","Beskrivelse","","item1;item2","09:00","12:00","Sted",""',
      '"dag1","1. aug","Mandag","Aktivitet B","","https://example.com","","13:00","15:00","Sted2","https://maps.google.com"',
    ].join("\n");

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(csvData),
      }),
    );

    const { days } = await fetchProgram();

    expect(days).toHaveLength(1);
    expect(days[0].id).toBe("dag1");
    expect(days[0].label).toBe("Mandag");
    expect(days[0].activities).toHaveLength(2);

    const [a, b] = days[0].activities;
    expect(a.title).toBe("Aktivitet A");
    expect(a.description).toBe("Beskrivelse");
    expect(a.subItems).toEqual(["item1", "item2"]);
    expect(a.startTime).toBe("09:00");
    expect(a.endTime).toBe("12:00");
    expect(a.location).toBe("Sted");

    expect(b.title).toBe("Aktivitet B");
    expect(b.url).toBe("https://example.com");
    expect(b.mapUrl).toBe("https://maps.google.com");
  });

  it("returns fallback when CSV has no data rows", async () => {
    const csvData =
      '"id","date","label","title","description","url","sub_items","start_time","end_time","location","map_url"';

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(csvData),
      }),
    );

    const { days } = await fetchProgram();
    expect(days).toEqual(fallbackProgram);
  });
});
