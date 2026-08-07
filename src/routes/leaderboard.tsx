import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Flame, Gauge, Ruler, Star, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/section";
import { RacePodium } from "@/components/podium";
import { TournamentBoard } from "@/components/tournament-board";
import { usePlayers, useRoundTotals } from "@/lib/data";
import { insights, standings } from "@/lib/tournament";
import { ROUNDS } from "@/lib/tour";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Tournament Leaderboard — SBF Golf Tour 2027, Lisbon" },
      {
        name: "description",
        content:
          "Overall Stableford standings for the SBF Golf Tour 2027 in Lisbon: podium, daily leaderboards, biggest climber, best round and player of the day.",
      },
      { property: "og:title", content: "Tournament Leaderboard — SBF Golf Tour 2027" },
      {
        property: "og:description",
        content: "Race to Lisbon podium and running Stableford standings across all three rounds.",
      },
    ],
  }),
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const [scope, setScope] = useState<number | "overall">("overall");
  const { data: players = [] } = usePlayers();
  const { data: totals = [] } = useRoundTotals();

  const rows = standings(players, totals, scope);
  const overallRows = standings(players, totals, "overall");
  const info = insights(overallRows, totals);

  return (
    <>
      <PageHeader
        eyebrow="Standings"
        title="Tournament Leaderboard"
        intro="Golf GameBook handles live scoring on course. The organiser enters one Stableford total per player after each round and everything below updates instantly."
      />
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6">
        <RacePodium rows={overallRows} />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Stat
            icon={TrendingUp}
            label="Biggest climber"
            value={info.climber ? info.climber.player.name : "—"}
            sub={info.climber ? `Up ${info.climber.movement} place${info.climber.movement > 1 ? "s" : ""}` : "After round 2"}
          />
          <Stat icon={Gauge} label="Average Stableford" value={info.average || "—"} sub="Across all rounds entered" />
          <Stat
            icon={Flame}
            label="Best single round"
            value={info.bestRound ? `${info.bestRound.points} pts` : "—"}
            sub={info.bestRound ? `${info.bestRound.row.player.name} · R${info.bestRound.round}` : "Awaiting scores"}
          />
          <Stat
            icon={Ruler}
            label="Tightest leaderboard"
            value={info.roundsPlayed ? `${info.gap} pts` : "—"}
            sub="Gap across the top three"
          />
          <Stat
            icon={Star}
            label="Player of the day"
            value={info.playerOfTheDay ? info.playerOfTheDay.row.player.name : "—"}
            sub={info.playerOfTheDay ? `${info.playerOfTheDay.points} pts in R${info.roundsPlayed}` : "Awaiting scores"}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Tab active={scope === "overall"} onClick={() => setScope("overall")} label="Overall" />
          {ROUNDS.map((r) => (
            <Tab key={r.no} active={scope === r.no} onClick={() => setScope(r.no)} label={r.label} />
          ))}
        </div>

        <TournamentBoard rows={rows} scope={scope} />
      </div>
    </>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Star;
  label: string;
  value: string | number;
  sub: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass rounded-2xl p-4"
    >
      <Icon className="size-4 text-gold" strokeWidth={1.6} />
      <p className="mt-3 text-[0.6rem] uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
      <p className="mt-1 truncate font-display text-2xl leading-none">{value}</p>
      <p className="mt-1 truncate text-xs text-muted-foreground">{sub}</p>
    </motion.div>
  );
}

function Tab({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-5 py-2 font-display text-base tracking-wider transition-colors ${
        active ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"
      }`}
    >
      {label}
    </button>
  );
}
