import fs from "fs";
import path from "path";
import crypto from "crypto";

/**
 * Хранилище подписчиков на рассылку — простой JSON-файл, не БД (объём
 * небольшой). Файл лежит в data/ (в .gitignore — переживает деплои, git pull
 * его не трогает и не публикует email-адреса в открытый репозиторий).
 *
 * Токен нужен для ссылки отписки (/unsubscribe?token=...), чтобы не палить
 * голый email в URL и чтобы отписка не требовала пароля/логина.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const SUBSCRIBERS_PATH = path.join(DATA_DIR, "subscribers.json");

export interface Subscriber {
  email: string;
  token: string;
  subscribedAt: string;
}

function readSubscribers(): Subscriber[] {
  if (!fs.existsSync(SUBSCRIBERS_PATH)) return [];
  try {
    const raw = fs.readFileSync(SUBSCRIBERS_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("[subscribers] Не удалось прочитать subscribers.json:", err);
    return [];
  }
}

function writeSubscribers(list: Subscriber[]): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(SUBSCRIBERS_PATH, JSON.stringify(list, null, 2), "utf8");
}

export interface AddSubscriberResult {
  token: string;
  alreadySubscribed: boolean;
}

/** Добавляет подписчика (без дублей по email, регистронезависимо). */
export function addSubscriber(rawEmail: string): AddSubscriberResult {
  const email = rawEmail.trim().toLowerCase();
  const list = readSubscribers();
  const existing = list.find((s) => s.email.toLowerCase() === email);
  if (existing) {
    return { token: existing.token, alreadySubscribed: true };
  }

  const token = crypto.randomBytes(24).toString("hex");
  list.push({ email, token, subscribedAt: new Date().toISOString() });
  writeSubscribers(list);
  return { token, alreadySubscribed: false };
}

/** Удаляет подписчика по токену. Возвращает true, если запись была найдена. */
export function removeSubscriberByToken(token: string): boolean {
  const list = readSubscribers();
  const next = list.filter((s) => s.token !== token);
  if (next.length === list.length) return false;
  writeSubscribers(next);
  return true;
}

export function getAllSubscribers(): Subscriber[] {
  return readSubscribers();
}
