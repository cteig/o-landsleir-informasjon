import { describe, it, expect } from "vitest";
import { parseCSVLine } from "../sheets";

describe("parseCSVLine", () => {
  it("parses simple unquoted fields", () => {
    expect(parseCSVLine("a,b,c")).toEqual(["a", "b", "c"]);
  });

  it("parses quoted fields", () => {
    expect(parseCSVLine('"hello","world"')).toEqual(["hello", "world"]);
  });

  it("handles commas inside quotes", () => {
    expect(parseCSVLine('"a,b",c')).toEqual(["a,b", "c"]);
  });

  it("handles escaped double quotes", () => {
    expect(parseCSVLine('"say ""hi""",ok')).toEqual(['say "hi"', "ok"]);
  });

  it("trims whitespace from fields", () => {
    expect(parseCSVLine("  a , b , c ")).toEqual(["a", "b", "c"]);
  });

  it("handles empty fields", () => {
    expect(parseCSVLine("a,,c")).toEqual(["a", "", "c"]);
  });

  it("handles a real Google Sheets CSV row", () => {
    const row =
      '"torsdag","30. juli","Torsdag","Ankomst","","","Info kl. 16;Egentrening","16:00","18:00","Skolen",""';
    const result = parseCSVLine(row);
    expect(result).toEqual([
      "torsdag",
      "30. juli",
      "Torsdag",
      "Ankomst",
      "",
      "",
      "Info kl. 16;Egentrening",
      "16:00",
      "18:00",
      "Skolen",
      "",
    ]);
  });
});
