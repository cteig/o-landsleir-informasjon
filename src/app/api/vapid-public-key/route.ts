export async function GET(): Promise<Response> {
  const publicKey = process.env.VAPID_PUBLIC_KEY ?? "";
  return new Response(publicKey, {
    headers: { "Content-Type": "text/plain" },
  });
}
