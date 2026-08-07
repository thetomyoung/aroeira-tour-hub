import { motion, AnimatePresence } from "motion/react";
import { Trophy } from "lucide-react";
import type { StandingRow } from "@/lib/tournament";

const STEP = [
  { h: "h-32 sm:h-44", tone: "text-gold", label: "1st", medal: "🥇" },
  { h: "h-24 sm:h-32", tone: "text-silver", label: "2nd", medal: "🥈" },
  { h: "h-20 sm:h-26", tone: "text-bronze", label: "3rd", medal: "🥉" },
];

function Step({ row, place }: { row: StandingRow | undefined; place: number }) {
  const s = STEP[place]!;
  return (
    <div className={`flex flex-col items-center justify-end ${place === 0 ? "order-2" : place === 1 ? "order-1" : "order-3"}`}>
      <div className="mb-3 h-14 text-center">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={row?.player.id ?? `empty-${place}`}
            initial={{ opacity: 0, y: -14, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
          >
            <p className="text-lg leading-none">{s.medal}</p>
            <p className="mt-1 max-w-24 truncate font-display text-lg leading-none sm:max-w-36 sm:text-2xl">
              {row?.player.name ?? "TBC"}
            </p>
            <p className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
              {row ? `${row.total} pts` : "—"}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
      <motion.div
        layout
        initial={{ scaleY: 0.4, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: place * 0.08 }}
        style={{ transformOrigin: "bottom" }}
        className={`glass-gold flex w-24 items-start justify-center rounded-t-xl pt-3 sm:w-36 ${s.h}`}
      >
        <span className={`font-display text-3xl sm:text-5xl ${s.tone}`}>{s.label}</span>
      </motion.div>
    </div>
  );
}

export function RacePodium({ rows }: { rows: StandingRow[] }) {
  const top = rows.filter((r) => r.played > 0).slice(0, 3);

  return (
    <section className="glass overflow-hidden rounded-3xl p-5 sm:p-8">
      <div className="flex items-center gap-2">
        <Trophy className="size-4 text-gold" />
        <p className="eyebrow">Race to Lisbon Champion</p>
      </div>
      <h2 className="mt-2 font-display text-3xl tracking-wide sm:text-5xl">
        <span className="text-gilded">The Podium</span>
      </h2>
      <div className="mt-8 flex items-end justify-center gap-2 sm:gap-4">
        {[1, 0, 2].map((i) => (
          <Step key={i} row={top[i]} place={i} />
        ))}
      </div>
      <div className="rule-gold mt-0" />
    </section>
  );
}
