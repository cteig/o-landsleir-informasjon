export const NTFY_SERVER = "https://ntfy.sh";
export const NTFY_TOPIC = "o-landsleir-2026";

export const NTFY_TOPIC_URL = `${NTFY_SERVER}/${NTFY_TOPIC}`;

export interface NtfyMessage {
  id: string;
  time: number;
  expires?: number;
  event: "open" | "keepalive" | "message" | "poll_request";
  topic: string;
  message?: string;
  title?: string;
  tags?: string[];
  priority?: 1 | 2 | 3 | 4 | 5;
  click?: string;
}

// ntfy returns newline-delimited JSON (NDJSON), not a JSON array
export async function fetchMessages(since = "24h"): Promise<NtfyMessage[]> {
  const res = await fetch(`${NTFY_TOPIC_URL}/json?poll=1&since=${since}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`ntfy fetch failed: ${res.status}`);
  }

  const text = await res.text();
  const lines = text.trim().split("\n").filter(Boolean);

  const messages: NtfyMessage[] = [];
  for (const line of lines) {
    try {
      const msg: NtfyMessage = JSON.parse(line);
      if (msg.event === "message") {
        messages.push(msg);
      }
    } catch {
      // noop
    }
  }

  return messages.sort((a, b) => b.time - a.time);
}

export function subscribeSSE(onMessage: (msg: NtfyMessage) => void): () => void {
  const eventSource = new EventSource(`${NTFY_TOPIC_URL}/sse`);

  eventSource.onmessage = (e) => {
    try {
      const msg: NtfyMessage = JSON.parse(e.data);
      if (msg.event === "message") {
        onMessage(msg);
      }
    } catch {
      // noop
    }
  };

  return () => eventSource.close();
}

export function formatTime(unixTime: number): string {
  const date = new Date(unixTime * 1000);
  return date.toLocaleString("no-NO", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function priorityLabel(priority?: number): string | null {
  switch (priority) {
    case 5:
      return "Haster";
    case 4:
      return "Viktig";
    case 1:
      return "Lav";
    default:
      return null;
  }
}

const TAG_EMOJI: Record<string, string> = {
  warning: "\u26a0\ufe0f",
  skull: "\ud83d\udc80",
  rotating_light: "\ud83d\udea8",
  tada: "\ud83c\udf89",
  loudspeaker: "\ud83d\udce2",
  mega: "\ud83d\udce3",
  bell: "\ud83d\udd14",
  calendar: "\ud83d\udcc5",
  runner: "\ud83c\udfc3",
  trophy: "\ud83c\udfc6",
  rain_cloud: "\ud83c\udf27\ufe0f",
  sun: "\u2600\ufe0f",
  information_source: "\u2139\ufe0f",
  fork_and_knife: "\ud83c\udf74",
};

export function tagsToEmoji(tags?: string[]): string {
  if (!tags?.length) return "";
  return tags
    .map((t) => TAG_EMOJI[t] || "")
    .filter(Boolean)
    .join(" ");
}
