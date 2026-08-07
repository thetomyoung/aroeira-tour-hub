import { motion } from "motion/react";
import { ChevronDown, ChevronUp, Minus, Trophy } from "lucide-react";
import type { StandingRow } from "@/lib/tournament";
import { ROUNDS } from "@/lib/tour";

const MEDAL = ["text-gold", "text-silver", "text-bronze"];
const ROW_TINT = ["bg-gold/10 border-gold/50", "bg-secondary/70 border-silver/50", "bg-bronze/10 border-bronze/40"];

export function TournamentBoard({
  rows,
  scope,
}: {
  rows: StandingRow[];
  scope: number | "overall";
}) {
  if (!rows.length) {
    return <p className="glass rounded-2xl p-6 text-sm text-muted-foreground">No players yet.</p>;
  }

  const roundCols = scope === "overall" ? ROUNDS : ROUNDS.filter((r) => r.no === scope);

  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[38rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
              <th className="px-4 py-3 text-left">Pos</th>
              <th className="px-4 py-3 text-left">Player</th>
              {roundCols.map((r) => (
                <th key={r.no} className="px-3 py-3 text-right">
                  R{r.no}
                </th>
              ))}
              <th className="px-3 py-3 text-right">Avg</th>
              <th className="px-3 py-3 text-right">Best</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <motion.tr
                key={row.player.id}
                layout
                layoutId={row.player.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 28, delay: Math.min(i * 0.03, 0.3) }}
                className={`border-b border-l-2 border-border ${i < 3 ? ROW_TINT[i] : "border-l-transparent"}`}
              >
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 font-display text-xl">
                    {i < 3 && <Trophy className={`size-3.5 ${MEDAL[i]}`} />}
                    {row.position}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2">
                    <span className="block truncate font-semibold">{row.player.name}</span>
                    <Movement value={row.movement} />
                  </span>
                  <span className="text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                    hcp {row.player.handicap}
                  </span>
                </td>
                {roundCols.map((r) => (
                  <td key={r.no} className="px-3 py-3 text-right tabular-nums">
                    {row.byRound[r.no] ?? "–"}
                  </td>
                ))}
                <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">
                  {row.played ? row.average : "–"}
                </td>
                <td className="px-3 py-3 text-right tabular-nums">{row.best || "–"}</td>
                <td className="px-4 py-3 text-right font-display text-2xl text-primary">{row.total}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Movement({ value }: { value: number }) {
  if (!value) return <Minus className="size-3 text-muted-foreground" />;
  const up = value > 0;
  return (
    <span className={`inline-flex items-center text-[0.65rem] font-semibold ${up ? "text-fairway" : "text-destructive"}`}>
      {up ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
      {Math.abs(value)}
    </span>
  );
}
