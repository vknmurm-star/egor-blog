/**
 * Простой in-memory rate-limit (sliding window). Подходит для одного
 * инстанса PM2 (fork). Ключ — обычно `${action}:${ip}`.
 *
 * Скопировано из andreev-site (src/lib/rateLimit.ts).
 */

const hits = new Map<string, number[]>();

export interface RateResult {
  ok: boolean;
  retryAfterSec?: number;
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateResult {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

  if (arr.length >= limit) {
    const retryAfterSec = Math.ceil((arr[0] + windowMs - now) / 1000);
    hits.set(key, arr);
    return { ok: false, retryAfterSec: Math.max(1, retryAfterSec) };
  }

  arr.push(now);
  hits.set(key, arr);
  return { ok: true };
}

/**
 * Извлекает IP клиента из заголовков за nginx. Приоритет — X-Real-IP: nginx
 * всегда перезаписывает его через proxy_set_header X-Real-IP $remote_addr,
 * клиент не может его подделать. X-Forwarded-For раньше стоял первым и был
 * уязвим: nginx собирал его через $proxy_add_x_forwarded_for, который
 * ДОПИСЫВАЕТ реальный IP к уже пришедшему значению заголовка, а не
 * заменяет его, поэтому запрос с "X-Forwarded-For: 1.2.3.4" превращался в
 * "1.2.3.4, <реальный IP>", и код брал первый (поддельный) элемент — это
 * полностью обходило rate-limit (тот же баг и фикс, что на andreev-zakon.ru).
 * nginx исправлен на X-Forwarded-For $remote_addr (тоже без клиентского
 * значения), но код всё равно не должен полагаться на этот заголовок как
 * на первичный источник.
 */
export function clientIp(headers: Headers): string {
  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return "unknown";
}

// Периодическая чистка, чтобы Map не рос бесконечно.
const CLEAN_INTERVAL = 10 * 60 * 1000;
let lastClean = Date.now();
export function maybeCleanup(maxWindowMs = 60 * 60 * 1000) {
  const now = Date.now();
  if (now - lastClean < CLEAN_INTERVAL) return;
  lastClean = now;
  for (const [k, arr] of hits) {
    const kept = arr.filter((t) => now - t < maxWindowMs);
    if (kept.length === 0) hits.delete(k);
    else hits.set(k, kept);
  }
}
