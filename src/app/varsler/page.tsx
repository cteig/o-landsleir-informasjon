"use client";

import { useEffect, useState, useCallback, useSyncExternalStore } from "react";
import {
  type NtfyMessage,
  fetchMessages,
  subscribeSSE,
  formatTime,
  priorityLabel,
  tagsToEmoji,
} from "@/lib/ntfy";

const SEEN_KEY = "ntfy-seen-ids";

type NotifPerm = "default" | "granted" | "denied" | "unsupported";

let currentPermission: NotifPerm =
  typeof window !== "undefined" && "Notification" in window
    ? (Notification.permission as NotifPerm)
    : "unsupported";

const permListeners = new Set<() => void>();

function subscribePerm(cb: () => void) {
  permListeners.add(cb);
  return () => permListeners.delete(cb);
}

function getPermSnapshot(): NotifPerm {
  return currentPermission;
}

function getPermServerSnapshot(): NotifPerm {
  return "unsupported";
}

function updatePermission(perm: NotifPerm) {
  currentPermission = perm;
  permListeners.forEach((cb) => cb());
}

function showBrowserNotification(msg: NtfyMessage) {
  if (currentPermission !== "granted") return;
  if (document.visibilityState === "visible") return;

  const title = msg.title || "O-landsleir 2026";
  new Notification(title, {
    body: msg.message || "",
    icon: "/icon-192.png",
    tag: msg.id,
  });
}

function NotificationToggle() {
  const permission = useSyncExternalStore(subscribePerm, getPermSnapshot, getPermServerSnapshot);

  if (permission === "unsupported") return null;

  if (permission === "granted") {
    return (
      <div className="border-border bg-card mb-6 flex items-center gap-3 rounded-2xl border p-4 shadow-sm">
        <span className="text-base">🔔</span>
        <span className="text-foreground text-sm">Varsler er aktivert</span>
      </div>
    );
  }

  if (permission === "denied") {
    return (
      <div className="border-border bg-card mb-6 flex items-center gap-3 rounded-2xl border p-4 shadow-sm">
        <span className="text-base">🔕</span>
        <span className="text-muted text-sm">
          Varsler er blokkert. Endre i nettleserinnstillingene.
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={async () => {
        const result = await Notification.requestPermission();
        updatePermission(result as NotifPerm);
      }}
      className="bg-accent hover:bg-accent-hover mb-6 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-medium text-white shadow-sm transition-colors active:scale-[0.98]"
    >
      🔔 Slå på varsler
    </button>
  );
}

function markAllSeen(messages: NtfyMessage[]) {
  const ids = messages.map((m) => m.id);
  localStorage.setItem(SEEN_KEY, JSON.stringify(ids));
}

function PriorityBadge({ priority }: { priority?: number }) {
  const label = priorityLabel(priority);
  if (!label) return null;

  const color =
    priority === 5
      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      : priority === 4
        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";

  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>{label}</span>;
}

function MessageCard({ msg }: { msg: NtfyMessage }) {
  const emoji = tagsToEmoji(msg.tags);

  return (
    <div className="border-border bg-card rounded-2xl border p-4 shadow-sm sm:p-5">
      <div className="mb-1 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {emoji && <span className="text-base">{emoji}</span>}
          {msg.title && (
            <h3 className="text-foreground text-sm font-semibold sm:text-base">{msg.title}</h3>
          )}
        </div>
        <PriorityBadge priority={msg.priority} />
      </div>
      {msg.message && (
        <p className="text-foreground mt-1 text-sm leading-relaxed whitespace-pre-wrap">
          {msg.message}
        </p>
      )}
      <time className="text-muted mt-2 block text-xs">{formatTime(msg.time)}</time>
      {msg.click && (
        <a
          href={msg.click}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent mt-2 inline-block text-xs hover:underline"
        >
          Les mer ↗
        </a>
      )}
    </div>
  );
}

export default function VarslerPage() {
  const [messages, setMessages] = useState<NtfyMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMessages = useCallback(async () => {
    try {
      const msgs = await fetchMessages("7d");
      setMessages(msgs);
      setError(null);
      markAllSeen(msgs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke hente varsler");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    const cleanup = subscribeSSE((msg) => {
      showBrowserNotification(msg);
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        const updated = [msg, ...prev];
        markAllSeen(updated);
        return updated;
      });
    });
    return cleanup;
  }, []);

  return (
    <div className="bg-background flex flex-1 flex-col items-center font-sans">
      <main className="w-full max-w-2xl px-5 py-12 sm:px-6 sm:py-20">
        <header className="mb-10 text-center">
          <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">Varsler</h1>
          <p className="text-muted mt-2 text-base sm:text-lg">Meldinger fra arrangøren</p>
        </header>

        <NotificationToggle />

        {loading && (
          <div className="flex justify-center py-12">
            <div className="border-accent h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
          </div>
        )}

        {error && (
          <div className="border-border bg-card rounded-2xl border p-5 text-center shadow-sm">
            <p className="text-muted text-sm">{error}</p>
            <button
              onClick={loadMessages}
              className="text-accent mt-3 text-sm font-medium hover:underline"
            >
              Prøv igjen
            </button>
          </div>
        )}

        {!loading && !error && messages.length === 0 && (
          <div className="border-border bg-card rounded-2xl border p-8 text-center shadow-sm">
            <p className="text-muted text-sm">Ingen varsler ennå</p>
            <p className="text-muted mt-1 text-xs">Meldinger fra arrangøren vil dukke opp her</p>
          </div>
        )}

        {messages.length > 0 && (
          <div className="flex flex-col gap-3">
            {messages.map((msg) => (
              <MessageCard key={msg.id} msg={msg} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
