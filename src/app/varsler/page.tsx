"use client";

import { useEffect, useState, useCallback } from "react";
import { markVarslerSeen } from "@/lib/use-unread-varsler";
import { usePushSubscription } from "@/lib/use-push-subscription";

interface PushMessage {
  id: string;
  title: string;
  body: string;
  time: number;
}

function formatTime(unixTime: number): string {
  const date = new Date(unixTime * 1000);
  return date.toLocaleString("no-NO", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MessageCard({ msg }: { msg: PushMessage }) {
  return (
    <div className="border-border bg-card rounded-2xl border p-4 shadow-sm sm:p-5">
      <h3 className="text-foreground text-sm font-semibold sm:text-base">{msg.title}</h3>
      <p className="text-foreground mt-1 text-sm leading-relaxed whitespace-pre-wrap">{msg.body}</p>
      <time className="text-muted mt-2 block text-xs">{formatTime(msg.time)}</time>
    </div>
  );
}

export default function VarslerPage() {
  const { pushState, subscribe } = usePushSubscription();
  const [messages, setMessages] = useState<PushMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);

  const loadMessages = useCallback(async () => {
    try {
      const res = await fetch("/api/push/messages");
      if (res.ok) {
        const data: PushMessage[] = await res.json();
        setMessages(data);
        if (data.length > 0) {
          markVarslerSeen(data[0].time);
        }
      }
    } catch {
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();

    function refetchOnVisible() {
      if (document.visibilityState === "visible") loadMessages();
    }
    document.addEventListener("visibilitychange", refetchOnVisible);
    return () => document.removeEventListener("visibilitychange", refetchOnVisible);
  }, [loadMessages]);

  return (
    <div className="bg-background flex flex-1 flex-col items-center font-sans">
      <main className="w-full max-w-2xl px-5 py-12 sm:px-6 sm:py-20">
        <header className="mb-10 text-center">
          <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">Varsler</h1>
          <p className="text-muted mt-2 text-base sm:text-lg">Meldinger fra arrangøren</p>
        </header>

        {pushState === "unsupported" && (
          <div className="border-border bg-card mb-6 rounded-2xl border p-5 text-center shadow-sm">
            <p className="text-muted text-sm">Push-varsler støttes ikke i denne nettleseren.</p>
          </div>
        )}

        {pushState === "not-installed" && (
          <div className="border-border bg-card mb-6 rounded-2xl border p-5 shadow-sm">
            <p className="text-foreground mb-2 text-sm font-semibold">
              Installer appen for å aktivere varsler
            </p>
            <p className="text-muted text-sm">
              Trykk <strong>dele-ikonet</strong> (⬆) nederst i Safari, velg{" "}
              <strong>&quot;Legg til på Hjem-skjerm&quot;</strong>, og åpne appen derfra.
            </p>
          </div>
        )}

        {pushState === "denied" && (
          <div className="border-border bg-card mb-6 flex items-center gap-3 rounded-2xl border p-4 shadow-sm">
            <span className="text-base">🔕</span>
            <span className="text-muted text-sm">
              Varsler er blokkert. Endre i nettleserinnstillingene.
            </span>
          </div>
        )}

        {pushState === "default" && (
          <button
            onClick={subscribe}
            className="bg-accent hover:bg-accent-hover mb-6 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-medium text-white shadow-sm transition-colors active:scale-[0.98]"
          >
            🔔 Slå på push-varsler
          </button>
        )}

        {loadingMessages && (
          <div className="flex justify-center py-12">
            <div className="border-accent h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
          </div>
        )}

        {!loadingMessages && messages.length === 0 && (
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
