import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

export interface PushMessage {
  id: string;
  title: string;
  body: string;
  time: number;
}

const DATA_DIR = join(process.cwd(), "data");
const MESSAGES_FILE = join(DATA_DIR, "push-messages.json");

async function ensureDataDir(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
}

export async function getMessages(): Promise<PushMessage[]> {
  try {
    const raw = await readFile(MESSAGES_FILE, "utf-8");
    return JSON.parse(raw) as PushMessage[];
  } catch {
    return [];
  }
}

export async function addMessage(title: string, body: string): Promise<PushMessage> {
  const messages = await getMessages();
  const msg: PushMessage = {
    id: crypto.randomUUID(),
    title,
    body,
    time: Math.floor(Date.now() / 1000),
  };
  messages.unshift(msg);
  await ensureDataDir();
  await writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2), "utf-8");
  return msg;
}
