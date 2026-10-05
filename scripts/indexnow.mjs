#!/usr/bin/env node
/**
 * Отправка всех адресов из sitemap.xml в IndexNow (Яндекс, Bing и др.) одним запросом.
 * Запускается из deploy.sh после сборки и рестарта. Без внешних зависимостей.
 * Ключ лежит в public/<ключ>.txt (файл с ключом внутри отдаётся с корня сайта).
 * Выводит код ответа; коды 200 и 202 означают, что запрос принят.
 */
import fs from "fs";
import path from "path";

const HOST = "egorpoet.ru";
const SITEMAP = `https://${HOST}/sitemap.xml`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

const publicDir = path.join(process.cwd(), "public");
const keyFile = fs.readdirSync(publicDir).find((f) => /^[0-9a-zA-Z]{32}\.txt$/.test(f));
if (!keyFile) {
  console.error("indexnow: в public/ нет файла ключа <32 символа>.txt");
  process.exit(1);
}
const key = keyFile.replace(/\.txt$/, "");

const sm = await fetch(SITEMAP);
if (!sm.ok) {
  console.error(`indexnow: sitemap.xml ответил ${sm.status}`);
  process.exit(1);
}
const xml = await sm.text();
const urlList = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
if (urlList.length === 0) {
  console.error("indexnow: в sitemap.xml нет адресов");
  process.exit(1);
}

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key, keyLocation: `https://${HOST}/${key}.txt`, urlList }),
});
console.log(`indexnow: отправлено адресов ${urlList.length}, ответ ${res.status}`);
if (res.status !== 200 && res.status !== 202) process.exit(1);
