import { motion } from "motion/react";
import { Ruler, Trophy, Flame, Club } from "lucide-react";
import type { Player } from "@/lib/golf";

export function PlayerCards({ players }: { players: Player[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {players.map((p, i) => (
        <motion.article
          key={p.id}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.4) }}
          className="glass overflow-hidden rounded-2xl"
        >
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border-b border-border/60 p-4">
            {p.photo_url ? (
              <img
                src={p.photo_url}
                alt={p.name}
                loading="lazy"
                className="size-12 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="grid size-12 shrink-0 place-items-center rounded-full border border-primary/40 font-display text-xl text-primary">
                {p.name.slice(0, 2).toUpperCase()}
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate font-display text-2xl leading-none">{p.name}</p>
              <p className="truncate text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                {p.current_form}
              </p>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-px bg-border/40">
            <Fact label="Handicap" value={String(p.handicap)} />
            <Fact label="Index" value={p.handicap_index.toFixed(1)} />
          </dl>

          <ul className="space-y-2 p-4 text-xs text-muted-foreground">
            <Row icon={Ruler} text={`${p.driving_distance} yd average drive`} />
            <Row icon={Trophy} text={`${p.previous_wins} previous tour wins`} />
            <Row icon={Club} text={`Favourite club: ${p.favourite_club}`} />
            <Row icon={Flame} text={`Form: ${p.current_form}`} />
          </ul>
        </motion.article>
      ))}
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card/60 px-4 py-3">
      <dt className="text-[0.55rem] uppercase tracking-[0.2em] text-muted-foreground">{label}</dt>
      <dd className="font-display text-2xl text-primary">{value}</dd>
    </div>
  );
}

function Row({ icon: Icon, text }: { icon: typeof Trophy; text: string }) {
  return (
    <li className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2">
      <Icon className="size-3.5 shrink-0 text-primary" />
      <span className="truncate">{text}</span>
    </li>
  );
}
