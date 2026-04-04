import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

interface PushSubscriptionRecord {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

const DATA_DIR = join(process.cwd(), "data");
const SUBS_FILE = join(DATA_DIR, "push-subscriptions.json");

async function ensureDataDir(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
}

export async function getSubscriptions(): Promise<PushSubscriptionRecord[]> {
  try {
    const raw = await readFile(SUBS_FILE, "utf-8");
    return JSON.parse(raw) as PushSubscriptionRecord[];
  } catch {
    return [];
  }
}

async function saveSubscriptions(subs: PushSubscriptionRecord[]): Promise<void> {
  await ensureDataDir();
  await writeFile(SUBS_FILE, JSON.stringify(subs, null, 2), "utf-8");
}

export async function addSubscription(sub: PushSubscriptionRecord): Promise<void> {
  const subs = await getSubscriptions();
  const exists = subs.some((s) => s.endpoint === sub.endpoint);
  if (!exists) {
    subs.push(sub);
    await saveSubscriptions(subs);
  }
}

export async function removeSubscription(endpoint: string): Promise<void> {
  const subs = await getSubscriptions();
  const filtered = subs.filter((s) => s.endpoint !== endpoint);
  await saveSubscriptions(filtered);
}
