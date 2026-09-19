"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "removed" | "not-found" | "error";

export default function UnsubscribeForm({ token }: { token: string }) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleUnsubscribe() {
    setStatus("loading");
    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        removed?: boolean;
      };
      if (!res.ok || !data.ok) {
        setStatus("error");
        return;
      }
      setStatus(data.removed ? "removed" : "not-found");
    } catch {
      setStatus("error");
    }
  }

  if (status === "removed") {
    return <p className="text-paper-muted">Вы отписаны от рассылки.</p>;
  }

  // Нейтральная формулировка: и просроченный, и уже использованный, и
  // подделанный токен выглядят для посетителя одинаково — незачем намекать,
  // существовала ли подписка с таким токеном вообще.
  if (status === "not-found") {
    return <p className="text-paper-muted">Вы уже не подписаны на рассылку.</p>;
  }

  if (status === "error") {
    return (
      <p className="text-paper-muted">
        Не удалось обработать запрос. Попробуйте ещё раз чуть позже.
      </p>
    );
  }

  return (
    <div>
      <p className="text-paper-muted mb-6">
        Вы уверены, что хотите отписаться от рассылки о новых стихах?
      </p>
      <button
        type="button"
        onClick={handleUnsubscribe}
        disabled={status === "loading"}
        className="px-7 py-3 bg-gold text-bg-deep font-medium rounded-full hover:bg-gold-soft transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "Отправка…" : "Отписаться"}
      </button>
    </div>
  );
}
