import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/section";
import { Leaderboard } from "@/components/leaderboard";
import { usePlayers, useScores } from "@/lib/data";
import { ROUNDS } from "@/lib/tour";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Live Leaderboard — 2027 Golf Tour, Aroeira" },
      {
        name: "description",
        content: "Live Ryder Cup style leaderboard for the 2027 Golf Tour at Aroeira: stableford, gross, nett, birdies and pars.",
      },
      { property: "og:title", content: "Live Leaderboard — 2027 Golf Tour" },
      { property: "og:description", content: "Real-time standings across all three rounds at Aroeira, Lisbon." },
    ],
  }),
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const [round, setRound] = useState<number | "overall">("overall");
  const { data: players = [] } = usePlayers();
  const { data: scores = [] } = useScores();

  return (
    <>
      <PageHeader
        eyebrow="Standings"
        title="Live Leaderboard"
        intro="Every score entered on the course updates this board instantly."
      />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-5 flex flex-wrap gap-2">
          <Tab active={round === "overall"} onClick={() => setRound("overall")} label="Overall" />
          {ROUNDS.map((r) => (
            <Tab key={r.no} active={round === r.no} onClick={() => setRound(r.no)} label={r.label} />
          ))}
        </div>
        <Leaderboard players={players} scores={scores} round={round} />
      </div>
    </>
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
