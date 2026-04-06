import { beforeAll, beforeEach, afterAll, describe, expect, it, vi } from "vitest";
import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

let tempDir = "";
let dataDir = "";
let pushStore: typeof import("../push-store");

describe("push-store", () => {
  beforeAll(async () => {
    tempDir = await mkdtemp(join(tmpdir(), "push-store-"));
    dataDir = join(tempDir, "data");
    vi.spyOn(process, "cwd").mockReturnValue(tempDir);
    pushStore = await import("../push-store");
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

    await expect(pushStore.getSubscriptions()).resolves.toEqual([]);
  });

  it("adds a subscription and persists it", async () => {
    const sub = {
      endpoint: "https://example.com/push",
      keys: {
        p256dh: "p256dh-key",
        auth: "auth-key",
      },
    };

    await pushStore.addSubscription(sub);

    expect(await pushStore.getSubscriptions()).toEqual([sub]);
  });

  it("does not duplicate subscriptions with the same endpoint", async () => {
    const sub = {
      endpoint: "https://example.com/push",
      keys: {
        p256dh: "p256dh-key",
        auth: "auth-key",
      },
    };
    const duplicate = {
      endpoint: "https://example.com/push",
      keys: {
        p256dh: "other-p256dh",
        auth: "other-auth",
      },
    };

    await pushStore.addSubscription(sub);
    await pushStore.addSubscription(duplicate);

    expect(await pushStore.getSubscriptions()).toEqual([sub]);
  });

  it("removes a subscription by endpoint", async () => {
    const first = {
      endpoint: "https://example.com/one",
      keys: {
        p256dh: "one-p256dh",
        auth: "one-auth",
      },
    };
    const second = {
      endpoint: "https://example.com/two",
      keys: {
        p256dh: "two-p256dh",
        auth: "two-auth",
      },
    };

    await pushStore.addSubscription(first);
    await pushStore.addSubscription(second);
    await pushStore.removeSubscription(first.endpoint);

    expect(await pushStore.getSubscriptions()).toEqual([second]);
  });

  it("returns remaining subscriptions after removal", async () => {
    const first = {
      endpoint: "https://example.com/one",
      keys: {
        p256dh: "one-p256dh",
        auth: "one-auth",
      },
    };
    const second = {
      endpoint: "https://example.com/two",
      keys: {
        p256dh: "two-p256dh",
        auth: "two-auth",
      },
    };

    await pushStore.addSubscription(first);
    await pushStore.addSubscription(second);
    await pushStore.removeSubscription(second.endpoint);

    expect(await pushStore.getSubscriptions()).toEqual([first]);
  });
});
