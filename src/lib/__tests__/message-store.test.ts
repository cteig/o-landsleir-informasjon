import { beforeAll, beforeEach, afterAll, describe, expect, it, vi } from "vitest";
import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

let tempDir = "";
let dataDir = "";
let messageStore: typeof import("../message-store");

describe("message-store", () => {
  beforeAll(async () => {
    tempDir = await mkdtemp(join(tmpdir(), "message-store-"));
    dataDir = join(tempDir, "data");
    vi.spyOn(process, "cwd").mockReturnValue(tempDir);
    messageStore = await import("../message-store");
  });

  beforeEach(async () => {
    await rm(dataDir, { recursive: true, force: true });
  });

  afterAll(async () => {
    vi.restoreAllMocks();
    await rm(tempDir, { recursive: true, force: true });
  });

  it("returns empty array when file doesn't exist", async () => {
    await mkdir(dataDir, { recursive: true });

    await expect(messageStore.getMessages()).resolves.toEqual([]);
  });

  it("creates the file and returns the new message", async () => {
    vi.spyOn(globalThis.crypto, "randomUUID").mockReturnValue("message-1");
    vi.spyOn(Date, "now").mockReturnValue(1_700_000_000_000);

    const message = await messageStore.addMessage("Hello", "Body");

    expect(message).toEqual({
      id: "message-1",
      title: "Hello",
      body: "Body",
      time: 1_700_000_000,
    });

    const saved = await messageStore.getMessages();
    expect(saved).toEqual([message]);
  });

  it("prepends newer messages", async () => {
    vi.spyOn(globalThis.crypto, "randomUUID")
      .mockReturnValueOnce("message-1")
      .mockReturnValueOnce("message-2");
    vi.spyOn(Date, "now")
      .mockReturnValueOnce(1_700_000_000_000)
      .mockReturnValueOnce(1_700_000_001_000);

    const first = await messageStore.addMessage("First", "One");
    const second = await messageStore.addMessage("Second", "Two");

    expect(await messageStore.getMessages()).toEqual([second, first]);
  });

  it("returns previously added messages", async () => {
    vi.spyOn(globalThis.crypto, "randomUUID")
      .mockReturnValueOnce("message-1")
      .mockReturnValueOnce("message-2");
    vi.spyOn(Date, "now")
      .mockReturnValueOnce(1_700_000_000_000)
      .mockReturnValueOnce(1_700_000_001_000);

    await messageStore.addMessage("First", "One");
    await messageStore.addMessage("Second", "Two");

    expect(await messageStore.getMessages()).toEqual([
      {
        id: "message-2",
        title: "Second",
        body: "Two",
        time: 1_700_000_001,
      },
      {
        id: "message-1",
        title: "First",
        body: "One",
        time: 1_700_000_000,
      },
    ]);
  });
});
