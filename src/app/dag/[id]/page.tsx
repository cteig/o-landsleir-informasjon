import Link from "next/link";
import { notFound } from "next/navigation";
import { program as fallbackProgram } from "@/data/activities";
import { fetchDayById } from "@/lib/program";
import { Activity } from "@/types/activity";

export async function generateStaticParams() {
  return fallbackProgram.map((day) => ({ id: day.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const day = await fetchDayById(id);
  if (!day) return {};
  return {
    title: `${day.label} ${day.date} - O-landsleiren 2026`,
  };
}

function TimeLocation({ activity }: { activity: Activity }) {
  const hasTime = activity.startTime || activity.endTime;
  const hasLocation = activity.location;

  if (!hasTime && !hasLocation) return null;

  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
      {hasTime && (
        <span>
          {activity.startTime}
          {activity.endTime && ` \u2013 ${activity.endTime}`}
        </span>
      )}
      {hasLocation &&
        (activity.mapUrl ? (
          <a
            href={activity.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-amber-700 underline underline-offset-2 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300"
          >
            {activity.location}
            <span aria-hidden="true" className="text-xs">
              \u2197
            </span>
          </a>
        ) : (
          <span>{activity.location}</span>
        ))}
    </div>
  );
}

function ActivityItem({ activity }: { activity: Activity }) {
  return (
    <li className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-baseline gap-2">
        {activity.url ? (
          <a
            href={activity.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-medium text-amber-700 underline underline-offset-2 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300"
          >
            {activity.title}
          </a>
        ) : (
          <span className="text-base font-medium text-zinc-900 dark:text-zinc-100">
            {activity.title}
          </span>
        )}
      </div>
      <TimeLocation activity={activity} />
      {activity.description && (
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {activity.description}
        </p>
      )}
      {activity.subItems && activity.subItems.length > 0 && (
        <ul className="mt-2 ml-4 flex flex-col gap-1">
          {activity.subItems.map((item) => (
            <li
              key={item}
              className="text-sm text-zinc-600 before:mr-2 before:content-['\u2022'] dark:text-zinc-400"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default async function DayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const day = await fetchDayById(id);

  if (!day) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-2xl px-6 py-16 sm:py-24">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <span aria-hidden="true">&larr;</span> Tilbake til program
        </Link>

        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {day.label}
          </h1>
          <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">{day.date}</p>
        </header>

        <ul className="flex flex-col gap-4">
          {day.activities.map((activity) => (
            <ActivityItem key={activity.title} activity={activity} />
          ))}
        </ul>
      </main>
    </div>
  );
}
