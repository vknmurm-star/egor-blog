import { NextRequest, NextResponse } from "next/server";
import { sendMail, adminEmail } from "@/lib/mailer";
import { clientIp, maybeCleanup, rateLimit } from "@/lib/rateLimit";
import { addSubscriber } from "@/lib/subscribers";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

// Простая, но достаточная проверка формата email для формы подписки.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Body {
  email?: string;
  website?: string; // honeypot — люди его не заполняют
  consent?: boolean;
}

export async function POST(req: NextRequest) {
  maybeCleanup();

  // Rate-limit: не более 5 подписок за 10 минут с одного IP.
  const ip = clientIp(req.headers);
  const rl = rateLimit(`subscribe:${ip}`, 5, 10 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Слишком много попыток. Попробуйте позже." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec ?? 60) } },
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  // Honeypot: если скрытое поле заполнено — это бот, тихо отклоняем.
  if (body.website && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const email = (body.email ?? "").trim();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Введите корректный e-mail" }, { status: 400 });
  }

  // Согласие на обработку персональных данных (152-ФЗ) — не полагаемся на
  // то, что фронтенд уже проверил чекбокс, запрос без него отклоняем и тут.
  if (body.consent !== true) {
    return NextResponse.json(
      { error: "Нужно согласие на обработку персональных данных" },
      { status: 400 },
    );
  }

  const { token, alreadySubscribed } = addSubscriber(email);

  // Уведомление админу — только для новых подписчиков, иначе повторная
  // отправка формы тем же адресом заваливала бы почту дублями.
  if (!alreadySubscribed) {
    const to = adminEmail();
    if (to) {
      await sendMail({
        to,
        subject: "Новый подписчик egorpoet.ru",
        html: `<p>Новый подписчик на рассылку: <strong>${email}</strong></p>`,
        text: `Новый подписчик на рассылку: ${email}`,
      });
    } else {
      console.error("[subscribe] ADMIN_EMAIL/SMTP_USER не настроены");
    }

    // Подтверждение подписчику — best-effort, не блокирует успешный ответ.
    const unsubscribeUrl = `${SITE_URL}/unsubscribe?token=${token}`;
    await sendMail({
      to: email,
      subject: "Подписка на рассылку Егора Андреева",
      html: `
        <p>Спасибо за подписку! Теперь вы будете получать письмо о каждом новом стихотворении на egorpoet.ru.</p>
        <p style="color:#888; font-size:12px; margin-top:24px;">
          Отписаться: <a href="${unsubscribeUrl}">${unsubscribeUrl}</a>
        </p>
      `,
      text: `Спасибо за подписку! Теперь вы будете получать письмо о каждом новом стихотворении на egorpoet.ru.\n\nОтписаться: ${unsubscribeUrl}`,
    });
  }

  return NextResponse.json({ ok: true });
}
