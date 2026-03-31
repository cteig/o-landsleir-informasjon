import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchMessages, formatTime, priorityLabel, tagsToEmoji, NTFY_TOPIC_URL } from "../ntfy";

describe("fetchMessages", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("parses NDJSON response and returns only message events", async () => {
    const ndjson = [
      '{"id":"open1","time":1000,"event":"open","topic":"test"}',
      '{"id":"msg1","time":2000,"event":"message","topic":"test","message":"Hello"}',
      '{"id":"ka1","time":3000,"event":"keepalive","topic":"test"}',
      '{"id":"msg2","time":4000,"event":"message","topic":"test","message":"World"}',
    ].join("\n");

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, text: () => Promise.resolve(ndjson) }),
    );

    const messages = await fetchMessages();

    expect(messages).toHaveLength(2);
    expect(messages.every((m) => m.event === "message")).toBe(true);
  });

  it("sorts messages newest-first", async () => {
    const ndjson = [
      '{"id":"old","time":1000,"event":"message","topic":"test","message":"Old"}',
      '{"id":"new","time":5000,"event":"message","topic":"test","message":"New"}',
      '{"id":"mid","time":3000,"event":"message","topic":"test","message":"Mid"}',
    ].join("\n");

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, text: () => Promise.resolve(ndjson) }),
    );

    const messages = await fetchMessages();

    expect(messages[0].id).toBe("new");
    expect(messages[1].id).toBe("mid");
    expect(messages[2].id).toBe("old");
  });

  it("throws on non-ok response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));

    await expect(fetchMessages()).rejects.toThrow("ntfy fetch failed: 500");
  });

  it("throws on network error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network error")));

    await expect(fetchMessages()).rejects.toThrow("network error");
  });

  it("skips malformed JSON lines gracefully", async () => {
    const ndjson = [
      '{"id":"msg1","time":1000,"event":"message","topic":"test","message":"OK"}',
      "this is not json",
      '{"id":"msg2","time":2000,"event":"message","topic":"test","message":"Also OK"}',
    ].join("\n");

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, text: () => Promise.resolve(ndjson) }),
    );

    const messages = await fetchMessages();
    expect(messages).toHaveLength(2);
  });

  it("returns empty array when response is empty", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, text: () => Promise.resolve("") }),
    );

    const messages = await fetchMessages();
    expect(messages).toEqual([]);
  });

  it("passes since parameter to the URL", async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, text: () => Promise.resolve("") });
    vi.stubGlobal("fetch", mockFetch);

    await fetchMessages("7d");

    expect(mockFetch).toHaveBeenCalledWith(`${NTFY_TOPIC_URL}/json?poll=1&since=7d`, {
      cache: "no-store",
    });
  });

  it("preserves title, tags, priority and click fields", async () => {
    const ndjson =
      '{"id":"full","time":1000,"event":"message","topic":"test","title":"Alert","message":"Body","tags":["warning"],"priority":5,"click":"https://example.com"}';

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, text: () => Promise.resolve(ndjson) }),
    );

    const [msg] = await fetchMessages();

    expect(msg.title).toBe("Alert");
    expect(msg.tags).toEqual(["warning"]);
    expect(msg.priority).toBe(5);
    expect(msg.click).toBe("https://example.com");
  });
});

describe("formatTime", () => {
  it("formats unix timestamp to Norwegian locale string", () => {
    const result = formatTime(1700000000);
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("produces different output for different timestamps", () => {
    const a = formatTime(1700000000);
    const b = formatTime(1700100000);
    expect(a).not.toBe(b);
  });
});

describe("priorityLabel", () => {
  it("returns 'Haster' for priority 5", () => {
    expect(priorityLabel(5)).toBe("Haster");
  });

  it("returns 'Viktig' for priority 4", () => {
    expect(priorityLabel(4)).toBe("Viktig");
  });

  it("returns 'Lav' for priority 1", () => {
    expect(priorityLabel(1)).toBe("Lav");
  });

  it("returns null for default priority (3)", () => {
    expect(priorityLabel(3)).toBeNull();
  });

  it("returns null for undefined", () => {
    expect(priorityLabel(undefined)).toBeNull();
  });

  it("returns null for priority 2", () => {
    expect(priorityLabel(2)).toBeNull();
  });
});

describe("tagsToEmoji", () => {
  it("maps known tags to emoji", () => {
    expect(tagsToEmoji(["warning"])).toBe("\u26a0\ufe0f");
    expect(tagsToEmoji(["trophy"])).toBe("\ud83c\udfc6");
  });

  it("joins multiple tag emojis with space", () => {
    const result = tagsToEmoji(["warning", "bell"]);
    expect(result).toBe("\u26a0\ufe0f \ud83d\udd14");
  });

  it("ignores unknown tags", () => {
    expect(tagsToEmoji(["unknown_tag"])).toBe("");
  });

  it("filters out unknown tags from mixed input", () => {
    expect(tagsToEmoji(["warning", "nonexistent", "trophy"])).toBe("\u26a0\ufe0f \ud83c\udfc6");
  });

  it("returns empty string for empty array", () => {
    expect(tagsToEmoji([])).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(tagsToEmoji(undefined)).toBe("");
  });
});
