"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

export function BottomNav() {
  const pathname = usePathname();

  const isProgramActive = pathname === "/" || pathname?.startsWith("/dag/");
  const isPraktiskInfoActive = pathname === "/praktisk-info";
  const isVarslerActive = pathname === "/varsler";
  const isKartActive = pathname === "/kart";
  const isKontaktActive = pathname === "/kontakt";

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
      </NavItem>

      <NavItem href="/kart" active={isKartActive} label="Kart">
        <NavIcon
          d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
          circles={[{ cx: 12, cy: 10, r: 3 }]}
        />
      </NavItem>

      <NavItem href="/kontakt" active={isKontaktActive} label="Kontakt">
        <NavIcon
          d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
          circles={[{ cx: 9, cy: 7, r: 4 }]}
        />
      </NavItem>
    </nav>
  );
}
