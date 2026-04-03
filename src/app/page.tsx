import Image from "next/image";
import Link from "next/link";
import { fetchProgram } from "@/lib/program";
import { ProgramDay } from "@/types/activity";

function DayCard({ day, index }: { day: ProgramDay; index: number }) {
  return (
    <Link
      href={`/dag/${day.id}`}
      className="group border-border bg-card hover:border-border-hover flex items-stretch gap-0 overflow-hidden rounded-2xl border shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
    >
      <div className="bg-accent flex w-16 shrink-0 flex-col items-center justify-center rounded-l-2xl text-white sm:w-20">
        <span className="text-xs font-medium tracking-wide uppercase opacity-80">Dag</span>
        <span className="text-2xl leading-none font-bold sm:text-3xl">{index + 1}</span>
      </div>
      <div className="flex min-h-[72px] min-w-0 flex-1 items-center justify-between gap-3 px-4 py-4 sm:px-5">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <h2 className="text-foreground text-base font-semibold sm:text-lg">{day.label}</h2>
            <span className="text-muted text-sm">{day.date}</span>
          </div>
          <p className="text-muted mt-1 truncate text-sm">
            {day.activities.map((a) => a.title).join(" \u00b7 ")}
          </p>
        </div>
        <span
          className="text-muted shrink-0 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        >
          &rarr;
        </span>
      </div>
    </Link>
  );
}

function UpdatedAt({ timestamp }: { timestamp: string }) {
  const date = new Date(timestamp);
  const formatted = date.toLocaleString("nb-NO", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
  return <p className="text-muted mt-6 text-center text-xs">Sist oppdatert: {formatted}</p>;
}

export default async function Home() {
  const { days, updatedAt } = await fetchProgram();

  return (
    <div className="bg-background flex flex-1 flex-col items-center font-sans">
      <main className="w-full max-w-2xl px-5 py-12 sm:px-6 sm:py-20">
        <header className="mb-10 text-center">
          <Image
            src="/LogoHLOLL2026.jpg"
            alt="O-landsleir med Hovedløp 2026"
            width={600}
            height={300}
            className="mx-auto mb-4 h-auto w-full max-w-md rounded-xl dark:brightness-90 dark:contrast-105"
            priority
          />
          <div className="bg-accent-subtle text-accent mb-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
            <span aria-hidden="true">🧭</span>
            30. juli – 5. august
          </div>
          <p className="text-muted mt-2 text-base sm:text-lg">Program for leiren 20206</p>
        </header>

        <div className="flex flex-col gap-3 sm:gap-4">
          {days.map((day, i) => (
            <DayCard key={day.id} day={day} index={i} />
          ))}
        </div>

        <UpdatedAt timestamp={updatedAt} />
        <p className="text-muted/50 mt-2 text-center font-mono text-[10px]">
          {process.env.NEXT_PUBLIC_GIT_SHA?.slice(0, 7) ?? "dev"}
        </p>
      </main>
    </div>
  );
}
