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
  const { day } = await fetchDayById(id);
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
    <div className="text-muted mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
      {hasTime && (
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="text-xs">
            🕐
          </span>
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
            className="text-accent hover:text-accent-hover inline-flex min-h-[44px] items-center gap-1.5 underline underline-offset-2"
          >
            <span aria-hidden="true" className="text-xs">
              📍
            </span>
            {activity.location}
            <span aria-hidden="true" className="text-xs">
              ↗
            </span>
          </a>
        ) : (
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="text-xs">
              📍
            </span>
            {activity.location}
          </span>
        ))}
    </div>
  );
}

function ActivityItem({ activity }: { activity: Activity }) {
  return (
    <li className="border-border bg-card rounded-xl border p-4 shadow-sm sm:p-5">
      <div className="flex items-baseline gap-2">
        {activity.url ? (
          <a
            href={activity.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent-hover inline-flex min-h-[44px] items-center text-base font-semibold underline underline-offset-2 sm:text-lg"
          >
            {activity.title}
            <span aria-hidden="true" className="ml-1.5 text-sm">
              ↗
            </span>
          </a>
        ) : (
          <span className="text-foreground text-base font-semibold sm:text-lg">
            {activity.title}
          </span>
        )}
      </div>
      <TimeLocation activity={activity} />
      {activity.description && (
        <p className="text-muted mt-2 text-sm leading-relaxed sm:text-base">
          {activity.description}
        </p>
      )}
      {activity.subItems && activity.subItems.length > 0 && (
        <ul className="mt-3 flex flex-col gap-1.5">
          {activity.subItems.map((item) => (
            <li key={item} className="text-muted flex items-start gap-2 text-sm sm:text-base">
              <span
                aria-hidden="true"
                className="bg-accent mt-1 block h-1.5 w-1.5 shrink-0 rounded-full opacity-60"
              />
              {item}
            </li>
          ))}
        </ul>
      )}
    </li>
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

export default async function DayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { day, updatedAt } = await fetchDayById(id);

  if (!day) {
    notFound();
  }

  return (
    <div className="bg-background flex flex-1 flex-col items-center font-sans">
      <div className="bg-background/95 border-border sticky top-0 z-40 w-full border-b backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-5 py-3 sm:px-6">
          <Link
            href="/"
            className="text-muted hover:bg-accent-subtle hover:text-foreground inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-sm font-medium"
            aria-label="Tilbake til program"
          >
            <span aria-hidden="true">&larr;</span>
          </Link>
          <div className="min-w-0">
            <h1 className="text-foreground truncate text-base font-semibold sm:text-lg">
              {day.label}
            </h1>
            <p className="text-muted text-xs sm:text-sm">{day.date}</p>
          </div>
        </div>
      </div>

      <main className="w-full max-w-2xl px-5 py-6 sm:px-6 sm:py-10">
        <ul className="flex flex-col gap-3 sm:gap-4">
          {day.activities.map((activity) => (
            <ActivityItem key={activity.title} activity={activity} />
          ))}
        </ul>
        <UpdatedAt timestamp={updatedAt} />
      </main>
    </div>
  );
}
