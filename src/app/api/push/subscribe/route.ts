import { NextResponse } from "next/server";
import { addSubscription } from "@/lib/push-store";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const sub = await request.json();

    if (!sub.endpoint || !sub.keys?.p256dh || !sub.keys?.auth) {
      return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
    }

    await addSubscription({
      endpoint: sub.endpoint,
      keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth },
    });

    return NextResponse.json(null, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 });
  }
}
