const SEEN_KEY = "ntfy-seen-ids";

type Listener = () => void;

const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((cb) => cb());
}

export function subscribeStore(cb: Listener): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function getSeenIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  const raw = localStorage.getItem(SEEN_KEY);
  return raw ? new Set(JSON.parse(raw)) : new Set();
}

export function markSeen(ids: string[]): void {
  if (typeof window === "undefined") return;
  const existing = getSeenIds();
  for (const id of ids) {
    existing.add(id);
  }
  localStorage.setItem(SEEN_KEY, JSON.stringify([...existing]));
  emit();
}
