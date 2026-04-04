import { NextResponse } from "next/server";
import { getMessages } from "@/lib/message-store";

export async function GET(): Promise<NextResponse> {
  const messages = await getMessages();
  return NextResponse.json(messages);
}
