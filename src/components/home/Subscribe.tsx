"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website, consent }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ошибка");
      setStatus("done");
      setMessage("Спасибо! Вы подписаны.");
      setEmail("");
      setConsent(false);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Что-то пошло не так");
    }
  }

  return (
    <section id="subscribe" className="bg-bg-deep py-24 px-6 sm:px-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mx-auto max-w-2xl text-center"
      >
        <h2 className="font-heading text-4xl sm:text-5xl text-paper">
          Оставайтесь на связи
        </h2>
        <p className="mt-4 text-paper-muted leading-relaxed">
          Новости, новые стихи и анонсы мероприятий
        </p>

        <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto">
          {/* Honeypot: скрыто от людей, боты часто заполняют все поля подряд */}
          <input
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ваш e-mail"
              className="flex-1 px-5 py-3 rounded-full bg-white/5 border border-line text-paper placeholder:text-paper-muted focus:outline-none focus:border-gold/60"
            />
            <button
              type="submit"
              disabled={status === "loading" || !consent}
              className="px-7 py-3 bg-gold text-bg-deep font-medium rounded-full hover:bg-gold-soft transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Отправка…" : "Подписаться"}
            </button>
          </div>

          <label className="mt-4 flex items-start gap-2 text-xs text-paper-muted text-left justify-center">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
              className="mt-0.5 accent-gold"
            />
            <span>
              Я согласен на{" "}
              <Link
                href="/privacy"
                className="text-gold-soft underline underline-offset-4 hover:text-gold"
              >
                обработку персональных данных
              </Link>
            </span>
          </label>
        </form>

        {message && (
          <p
            className={`mt-4 text-sm ${
              status === "error" ? "text-red-400" : "text-gold-soft"
            }`}
          >
            {message}
          </p>
        )}
      </motion.div>
    </section>
  );
}
