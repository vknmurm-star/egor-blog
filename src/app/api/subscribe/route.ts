import { NextRequest, NextResponse } from "next/server";

// Простая, но достаточная проверка формата email для формы подписки.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Заглушка: реальная интеграция с сервисом рассылки (Unisender/SendPulse/
// Resend) ещё не подключена — см. README.md, раздел "Подписка на новости".
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const email = (body as { email?: unknown })?.email;

  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Введите корректный e-mail" }, { status: 400 });
  }

  console.log(`[subscribe] новая заявка на подписку: ${email}`);

  return NextResponse.json({ ok: true });
}
