import { NextRequest, NextResponse } from "next/server";
import { removeSubscriberByToken } from "@/lib/subscribers";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const token = (body as { token?: unknown })?.token;
  if (typeof token !== "string" || !token) {
    return NextResponse.json({ error: "Некорректная ссылка" }, { status: 400 });
  }

  const removed = removeSubscriberByToken(token);
  // Отвечаем одинаково быстро и в том же формате независимо от того, был ли
  // токен найден — страница сама покажет нейтральный текст для обоих случаев.
  return NextResponse.json({ ok: true, removed });
}
