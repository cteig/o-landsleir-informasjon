import Link from "next/link";
import { fetchProgram } from "@/lib/program";
import { ProgramDay } from "@/types/activity";

function DayCard({ day }: { day: ProgramDay }) {
  return (
    <Link
      href={`/dag/${day.id}`}
      className="block rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-colors hover:border-amber-300 hover:bg-amber-50/50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-amber-700 dark:hover:bg-amber-950/20"
    >
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{day.label}</h2>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">{day.date}</span>
        </div>
        <span className="text-sm text-zinc-400 dark:text-zinc-500" aria-hidden="true">
          &rarr;
        </span>
      </div>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        {day.activities.map((a) => a.title).join(", ")}
      </p>
    </Link>
  );
}

export default async function Home() {
  const program = await fetchProgram();

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-2xl px-6 py-16 sm:py-24">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            O-landsleiren 2026
          </h1>
          <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">Program for leiren</p>
        </header>

        <div className="flex flex-col gap-4">
          {program.map((day) => (
            <DayCard key={day.id} day={day} />
          ))}
        </div>
      </main>
    </div>
  );
}
