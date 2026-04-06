"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useUnreadVarsler } from "@/lib/use-unread-varsler";
import { usePushSubscription } from "@/lib/use-push-subscription";
import { useTheme } from "./theme-toggle";

interface NavItemProps {
  href: string;
  active: boolean;
  label: string;
  children: React.ReactNode;
}

function NavItem({ href, active, label, children }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`relative flex flex-1 flex-col items-center justify-center gap-1 py-2 ${
        active ? "text-accent font-semibold" : "text-muted"
      }`}
    >
      <span className="relative">{children}</span>
      <span className="text-xs">{label}</span>
    </Link>
  );
}

function NavIcon({
  d,
  circles,
}: {
  d?: string;
  circles?: { cx: number; cy: number; r: number }[];
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {d && <path d={d} />}
      {circles?.map((c, i) => (
        <circle key={i} cx={c.cx} cy={c.cy} r={c.r} />
      ))}
    </svg>
  );
}

function MoreMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { theme, toggle } = useTheme();
  const { pushState, subscribe, unsubscribe } = usePushSubscription();

  const themeLabel = { light: "☀️ Lyst", dark: "🌙 Mørkt" }[theme];
  const canTogglePush = pushState === "subscribed" || pushState === "default";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative flex flex-1 flex-col items-center justify-center">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`relative flex flex-col items-center justify-center gap-1 py-2 ${
          open ? "text-accent font-semibold" : "text-muted"
        }`}
        aria-label="Meny"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
        <span className="text-xs">Mer</span>
      </button>

      {open && (
        <div className="border-border bg-card absolute right-0 bottom-full mb-2 w-48 rounded-xl border shadow-lg">
          <button
            onClick={toggle}
            className="text-foreground hover:bg-background flex w-full items-center gap-3 rounded-t-xl px-4 py-3 text-left text-sm"
          >
            <span className="text-base">{themeLabel.split(" ")[0]}</span>
            <span>Tema: {themeLabel.split(" ")[1]}</span>
          </button>
          {canTogglePush && (
            <button
              onClick={() => {
                if (pushState === "subscribed") {
                  unsubscribe();
                } else {
                  subscribe();
                }
                setOpen(false);
              }}
              className="text-foreground hover:bg-background flex w-full items-center gap-3 px-4 py-3 text-left text-sm"
            >
              <span className="text-base">{pushState === "subscribed" ? "🔕" : "🔔"}</span>
              <span>{pushState === "subscribed" ? "Slå av varsler" : "Slå på varsler"}</span>
            </button>
          )}
          <Link
            href="/kontakt"
            onClick={() => setOpen(false)}
            className="text-foreground hover:bg-background flex items-center gap-3 rounded-b-xl px-4 py-3 text-sm"
          >
            <span className="text-base">📞</span>
            <span>Kontakt</span>
          </Link>
        </div>
      )}
    </div>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const hasUnread = useUnreadVarsler();

  const isProgramActive = pathname === "/" || pathname?.startsWith("/dag/");
  const isPraktiskInfoActive = pathname === "/praktisk-info";
  const isVarslerActive = pathname === "/varsler";
  const isKartActive = pathname === "/kart";

  return (
    <nav className="border-border bg-card/95 fixed right-0 bottom-0 left-0 z-50 flex w-full flex-row border-t pb-[env(safe-area-inset-bottom)] backdrop-blur-sm">
      <NavItem href="/" active={isProgramActive} label="Program">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x1="3" x2="21" y1="10" y2="10" />
          <path d="M8 14h.01" />
          <path d="M12 14h.01" />
          <path d="M16 14h.01" />
          <path d="M8 18h.01" />
          <path d="M12 18h.01" />
          <path d="M16 18h.01" />
        </svg>
      </NavItem>

      <NavItem href="/praktisk-info" active={isPraktiskInfoActive} label="Info">
        <NavIcon circles={[{ cx: 12, cy: 12, r: 10 }]} d="M12 16v-4M12 8h.01" />
      </NavItem>

      <NavItem href="/varsler" active={isVarslerActive} label="Varsler">
        <NavIcon d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        {hasUnread && !isVarslerActive && (
          <span className="absolute -top-0.5 -right-1.5 h-2.5 w-2.5 rounded-full bg-red-500" />
        )}
      </NavItem>

      <NavItem href="/kart" active={isKartActive} label="Kart">
        <NavIcon d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4zM8 2v16M16 6v16" />
      </NavItem>

      <MoreMenu />
    </nav>
  );
}
