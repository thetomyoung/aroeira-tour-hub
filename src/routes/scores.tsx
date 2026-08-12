import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Check, Trophy } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/section";
import { RacePodium } from "@/components/podium";
import { usePlayers, useRoundTotals, useSaveRoundTotal } from "@/lib/data";
import { ROUNDS } from "@/lib/tour";
import { standings } from "@/lib/tournament";

export const Route = createFileRoute("/scores")({
  head: () => ({
    meta: [
      { title: "Enter Stableford Totals — SBF Golf Tour 2027, Lisbon" },
      {
        name: "description",
        content:
          "Organiser entry for the SBF Golf Tour 2027: one Stableford total per player per round, and the individual leaderboard updates instantly.",
      },
      { property: "og:title", content: "Enter Stableford Totals — SBF Golf Tour 2027" },
      {
        property: "og:description",
        content: "One number per player per round — the tournament standings do the rest.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ScoresPage,
});

function ScoresPage() {
  const { data: players = [] } = usePlayers();
  const { data: totals = [] } = useRoundTotals();
  const save = useSaveRoundTotal();

  const [roundNo, setRoundNo] = useState(1);
  const [draft, setDraft] = useState<Record<string, string>>({});

  useEffect(() => {
    const next: Record<string, string> = {};
    for (const p of players) {
      const t = totals.find((x) => x.player_id === p.id && x.round_no === roundNo);
      next[p.id] = t ? String(t.points) : "";
    }
    setDraft(next);
  }, [players, totals, roundNo]);

  const rows = standings(players, totals, "overall");

  async function saveAll() {
    const entries = players
      .map((p) => ({ p, raw: draft[p.id] ?? "" }))
      .filter((e) => e.raw.trim() !== "");
    if (!entries.length) {
      toast.error("Enter at least one total");
      return;
    }
    try {
      for (const e of entries) {
        await save.mutateAsync({ player_id: e.p.id, round_no: roundNo, points: Number(e.raw) });
      }
      toast.success(`Round ${roundNo} totals saved`);
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Scoring"
        title="Enter Stableford Totals"
        intro="Golf GameBook does the hole-by-hole scoring on course. Post one Stableford total per player for Round 1 and Round 3 — those two rounds decide the individual champion."
      />

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_1fr]">
        <div className="glass rounded-2xl p-5">
          <p className="mb-2 text-[0.6rem] uppercase tracking-[0.24em] text-muted-foreground">Round</p>
          <div className="flex flex-wrap gap-2">
            {ROUNDS.filter((r) => r.stableford).map((r) => (
              <button
                key={r.no}
                type="button"
                onClick={() => setRoundNo(r.no)}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  roundNo === r.no
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground"
                }`}
              >
                {r.label} · {r.format}
              </button>
            ))}
          </div>

          <ul className="mt-5 space-y-2">
            {players.map((p) => (
              <li
                key={p.id}
                className="grid grid-cols-[minmax(0,1fr)_5.5rem] items-center gap-3 rounded-xl bg-secondary/50 px-4 py-2.5"
              >
                <span className="truncate">
                  <span className="block font-semibold">{p.name}</span>
                  <span className="text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                    hcp {p.handicap}
                  </span>
                </span>
                <input
                  inputMode="numeric"
                  value={draft[p.id] ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, [p.id]: e.target.value.replace(/[^0-9]/g, "") }))
                  }
                  placeholder="–"
                  aria-label={`${p.name} Stableford points`}
                  className="rounded-lg border border-border bg-card px-3 py-2 text-center font-display text-2xl text-primary outline-none focus:ring-2 focus:ring-ring"
                />
              </li>
            ))}
          </ul>

          <button
            type="button"
            disabled={save.isPending || !players.length}
            onClick={() => void saveAll()}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-display text-lg tracking-wider text-primary-foreground disabled:opacity-50"
          >
            <Check className="size-4" /> Save round {roundNo} totals
          </button>
        </div>

        <div className="grid content-start gap-4">
          <RacePodium rows={rows} />

          <div className="glass rounded-2xl p-5">
            <p className="eyebrow flex items-center gap-2">
              <Trophy className="size-3.5 text-gold" /> Individual standings
            </p>
            <ol className="mt-3 space-y-1.5">
              {rows.map((r, i) => (
                <motion.li
                  key={r.player.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.3) }}
                  className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 text-sm"
                >
                  <span className="font-display text-lg text-muted-foreground">{r.position}</span>
                  <span className="truncate">{r.player.name}</span>
                  <span className="font-display text-xl text-primary">{r.total}</span>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}
