import { motion } from "motion/react";
import { Trophy } from "lucide-react";
import { leaderboard, type Player, type Score } from "@/lib/golf";

const MEDAL = ["text-gold", "text-silver", "text-bronze"];
const ROW_TINT = [
  "bg-primary/10 border-primary/40",
  "bg-secondary/60 border-border",
  "bg-bronze/10 border-bronze/30",
];

export function Leaderboard({
  players,
  scores,
  round,
}: {
  players: Player[];
  scores: Score[];
  round: number | "overall";
}) {
  const rows = leaderboard(players, scores, round);

  if (!players.length) {
    return <p className="glass rounded-2xl p-6 text-sm text-muted-foreground">No players yet.</p>;
  }

  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[46rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border/70 text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
              <th className="px-4 py-3 text-left">Pos</th>
              <th className="px-4 py-3 text-left">Player</th>
              <th className="px-3 py-3 text-right">Points</th>
              <th className="px-3 py-3 text-right">Gross</th>
              <th className="px-3 py-3 text-right">Nett</th>
              <th className="px-3 py-3 text-right">Birdies</th>
              <th className="px-3 py-3 text-right">Pars</th>
              <th className="px-3 py-3 text-right">Hole</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <motion.tr
                key={row.player.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.4) }}
                className={`border-b border-l-2 border-border/40 ${
                  i < 3 ? ROW_TINT[i] : "border-l-transparent"
                }`}
              >
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 font-display text-xl">
                    {i < 3 && <Trophy className={`size-3.5 ${MEDAL[i]}`} />}
                    {row.position}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="block truncate font-semibold">{row.player.name}</span>
                  <span className="text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                    hcp {row.player.handicap}
                  </span>
                </td>
                <td className="px-3 py-3 text-right font-display text-2xl text-primary">{row.points}</td>
                <td className="px-3 py-3 text-right tabular-nums">{row.gross || "–"}</td>
                <td className="px-3 py-3 text-right tabular-nums">{row.nett || "–"}</td>
                <td className="px-3 py-3 text-right tabular-nums">{row.birdies}</td>
                <td className="px-3 py-3 text-right tabular-nums">{row.pars}</td>
                <td className="px-3 py-3 text-right tabular-nums text-muted-foreground">
                  {row.currentHole ? `${row.currentHole}` : "–"}
                </td>
                <td className="px-4 py-3 text-right font-display text-2xl">{row.points}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
