"use client";

import { motion } from "framer-motion";

// TODO: демо-данные — заменить на реальные мероприятия.
const EVENTS = [
  { day: "12", month: "ОКТ", title: "Творческий вечер", place: "Москва" },
  { day: "25", month: "ОКТ", title: "Чтение стихов", place: "Санкт-Петербург" },
  { day: "10", month: "НОЯ", title: "Презентация книги", place: "Екатеринбург" },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function Events() {
  return (
    <section id="events" className="bg-bg-raised py-24 px-6 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-xl mb-14">
          <p className="text-xs tracking-[0.25em] uppercase text-gold-soft mb-4">
            События
          </p>
          <h2 className="font-heading text-4xl sm:text-5xl text-paper leading-tight">
            Встречи и чтения
          </h2>
          <p className="mt-4 text-paper-muted leading-relaxed">
            Живое звучание стихов — особая история. Буду рад видеть вас на
            ближайших мероприятиях.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid sm:grid-cols-3 gap-6"
        >
          {EVENTS.map((ev) => (
            <motion.div
              key={ev.title + ev.day}
              variants={item}
              className="glass-card rounded-2xl p-6 flex items-start gap-4"
            >
              <div className="text-center shrink-0">
                <div className="font-display text-3xl text-gold-soft leading-none">
                  {ev.day}
                </div>
                <div className="text-[11px] tracking-[0.2em] uppercase text-paper-muted mt-1">
                  {ev.month}
                </div>
              </div>
              <div className="min-w-0">
                <p className="font-heading text-xl text-paper">{ev.title}</p>
                <p className="text-sm text-paper-muted mt-1">{ev.place}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
