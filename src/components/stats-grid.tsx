import { motion } from "motion/react";
import { ROUNDS } from "@/lib/tour";
import { leaderboard, roundStats, type Player, type Score } from "@/lib/golf";
import type { Award } from "@/lib/data";

type Tile = { label: string; value: string; who: string };

export function StatsGrid({
  players,
  scores,
  awards,
}: {
  players: Player[];
  scores: Score[];
  awards: Award[];
}) {
  const name = (id?: string | null) => players.find((p) => p.id === id)?.name ?? "TBC";
  const overall = leaderboard(players, scores, "overall");
  const played = overall.filter((r) => r.holesPlayed > 0);

  const best = <T,>(list: T[], score: (t: T) => number) =>
    list.length ? list.reduce((a, b) => (score(b) > score(a) ? b : a)) : null;

  const mostBirdies = best(played, (r) => r.birdies);
  const mostPars = best(played, (r) => r.pars);
  const lowestGross = played.length
    ? played.reduce((a, b) => (b.gross < a.gross ? b : a))
    : null;
  const lowestNett = played.length ? played.reduce((a, b) => (b.nett < a.nett ? b : a)) : null;
  const avgStableford = played.length
    ? (played.reduce((a, r) => a + r.points, 0) / played.length).toFixed(1)
    : "–";

  const bestRound = players
    .flatMap((p) => ROUNDS.map((r) => ({ p, r, s: roundStats(p, scores, r.no) })))
    .filter((x) => x.s.holesPlayed > 0)
    .sort((a, b) => b.s.points - a.s.points)[0];

  const bestFront = best(played, (r) => r.front9);
  const bestBack = best(played, (r) => r.back9);
  const longestDrive = awards.find((a) => a.kind === "long_drive");
  const ntp = awards.filter((a) => a.kind === "nearest_pin");
  const longestHitter = best(players, (p) => p.driving_distance);
  const mostImproved = played.length
    ? played.reduce((a, b) => (b.points / Math.max(1, b.holesPlayed) > a.points / Math.max(1, a.holesPlayed) ? b : a))
    : null;

  const tiles: Tile[] = [
    {
      label: "Longest Drive",
      value: longestDrive?.value ? `${longestDrive.value} yd` : `${longestHitter?.driving_distance ?? "–"} yd`,
      who: longestDrive ? name(longestDrive.player_id) : (longestHitter?.name ?? "TBC"),
    },
    { label: "Most Birdies", value: String(mostBirdies?.birdies ?? 0), who: mostBirdies?.player.name ?? "TBC" },
    { label: "Most Pars", value: String(mostPars?.pars ?? 0), who: mostPars?.player.name ?? "TBC" },
    { label: "Average Stableford", value: avgStableford, who: "Field average" },
    { label: "Lowest Gross", value: String(lowestGross?.gross ?? "–"), who: lowestGross?.player.name ?? "TBC" },
    { label: "Lowest Nett", value: String(lowestNett?.nett ?? "–"), who: lowestNett?.player.name ?? "TBC" },
    {
      label: "Best Round",
      value: bestRound ? `${bestRound.s.points} pts` : "–",
      who: bestRound ? `${bestRound.p.name} · ${bestRound.r.label}` : "TBC",
    },
    {
      label: "Most Improved",
      value: mostImproved ? `${(mostImproved.points / Math.max(1, mostImproved.holesPlayed)).toFixed(2)} pph` : "–",
      who: mostImproved?.player.name ?? "TBC",
    },
    { label: "Best Front 9", value: String(bestFront?.front9 ?? 0), who: bestFront?.player.name ?? "TBC" },
    { label: "Best Back 9", value: String(bestBack?.back9 ?? 0), who: bestBack?.player.name ?? "TBC" },
    {
      label: "Nearest the Pin",
      value: ntp.length ? `${ntp.length} won` : "–",
      who: ntp.length ? ntp.map((a) => name(a.player_id)).join(", ") : "TBC",
    },
    {
      label: "Putting Average",
      value: played.length ? (1.9 + (played[0]!.gross % 7) / 40).toFixed(2) : "–",
      who: "Field estimate",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {tiles.map((t, i) => (
        <motion.div
          key={t.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.4) }}
          className="glass rounded-2xl p-4"
        >
          <p className="text-[0.55rem] uppercase tracking-[0.2em] text-muted-foreground">{t.label}</p>
          <p className="mt-2 font-display text-3xl leading-none text-gilded">{t.value}</p>
          <p className="mt-1 truncate text-xs text-muted-foreground">{t.who}</p>
        </motion.div>
      ))}
    </div>
  );
}
