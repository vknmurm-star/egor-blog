"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ошибка");
      setStatus("done");
      setMessage("Спасибо! Вы подписаны.");
      setEmail("");
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

        <form
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
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
            disabled={status === "loading"}
            className="px-7 py-3 bg-gold text-bg-deep font-medium rounded-full hover:bg-gold-soft transition-colors disabled:opacity-60"
          >
            {status === "loading" ? "Отправка…" : "Подписаться"}
          </button>
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
