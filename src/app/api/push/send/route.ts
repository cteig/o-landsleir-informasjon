import { NextResponse } from "next/server";
import * as webpushModule from "web-push";
import { getSubscriptions, removeSubscription } from "@/lib/push-store";
import { addMessage } from "@/lib/message-store";

// web-push is CJS — handle both ESM default interop and direct import
const webpush = (
  "default" in webpushModule ? (webpushModule as Record<string, unknown>).default : webpushModule
) as typeof webpushModule;

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY ?? "";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY ?? "";

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    "mailto:o-landsleir@utdanningsplattformen.online",
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY,
  );
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    let title: string;
    let body: string;

    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const json = await request.json();
      title = json.title;
      body = json.body;
    } else {
      // curl-style: Title in header, body as raw text
      title = request.headers.get("title") ?? "O-landsleir 2026";
      body = await request.text();
    }

    if (!body) {
      return NextResponse.json({ error: "Missing body" }, { status: 400 });
    }

    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
      return NextResponse.json({ error: "VAPID keys not configured" }, { status: 500 });
    }

    const subscriptions = await getSubscriptions();
    const payload = JSON.stringify({ title, body });

    let sent = 0;
    const errors: string[] = [];

    await Promise.all(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(sub, payload);
          sent++;
        } catch (err: unknown) {
          const statusCode = (err as { statusCode?: number }).statusCode;
          if (statusCode === 410 || statusCode === 404) {
            await removeSubscription(sub.endpoint);
          }
          errors.push(`${sub.endpoint.slice(0, 50)}...: ${statusCode ?? "unknown"}`);
        }
      }),
    );

    await addMessage(title, body);

    return NextResponse.json({ sent, total: subscriptions.length, errors });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Push send error:", message);
    return NextResponse.json(
      { error: "Failed to send notifications", detail: message },
      { status: 500 },
    );
  }
}
