import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Check, Minus, Plus, Target, Ruler } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/section";
import { usePlayers, useScores, useAwards } from "@/lib/data";
import { courseForRound, ROUNDS } from "@/lib/tour";
import { leaderboard, roundStats, stablefordPoints } from "@/lib/golf";

export const Route = createFileRoute("/scores")({
  head: () => ({
    meta: [
      { title: "Enter Scores — 2027 Golf Tour, Aroeira" },
      {
        name: "description",
        content: "Enter hole-by-hole gross scores and the 2027 Golf Tour hub calculates stableford, running totals and leaderboards automatically.",
      },
      { property: "og:title", content: "Enter Scores — 2027 Golf Tour" },
      { property: "og:description", content: "Fast on-course scoring with automatic stableford calculation." },
    ],
  }),
  component: ScoresPage,
});

function ScoresPage() {
  const qc = useQueryClient();
  const { data: players = [] } = usePlayers();
  const { data: scores = [] } = useScores();
  const { data: awards = [] } = useAwards();

  const [roundNo, setRoundNo] = useState(1);
  const [playerId, setPlayerId] = useState("");
  const [hole, setHole] = useState(1);
  const [gross, setGross] = useState(5);

  const player = players.find((p) => p.id === playerId) ?? players[0];
  const course = courseForRound(roundNo);
  const holeInfo = course.holes[hole - 1]!;

  const save = useMutation({
    mutationFn: async () => {
      if (!player) throw new Error("Add a player first");
      const { error } = await supabase
        .from("scores")
        .upsert(
          { player_id: player.id, round_no: roundNo, hole, gross },
          { onConflict: "player_id,round_no,hole" },
        );
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["scores"] });
      toast.success(`Hole ${hole} saved for ${player?.name}`);
      if (hole < 18) setHole(hole + 1);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const saveAward = useMutation({
    mutationFn: async (kind: "nearest_pin" | "long_drive") => {
      if (!player) throw new Error("Add a player first");
      const { error } = await supabase
        .from("awards")
        .insert({ kind, round_no: roundNo, player_id: player.id, detail: `Hole ${hole}`, value: gross });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["awards"] });
      toast.success("Award recorded");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const stats = useMemo(
    () => (player ? roundStats(player, scores, roundNo) : null),
    [player, scores, roundNo],
  );
  const points = player ? stablefordPoints(gross, holeInfo, player.handicap) : 0;
  const daily = leaderboard(players, scores, roundNo).slice(0, 5);
  const overall = leaderboard(players, scores, "overall").slice(0, 5);
  const ntp = awards.filter((a) => a.kind === "nearest_pin");
  const drives = awards.filter((a) => a.kind === "long_drive");
  const nameOf = (id?: string | null) => players.find((p) => p.id === id)?.name ?? "TBC";

  return (
    <>
      <PageHeader
        eyebrow="Scoring"
        title="Enter Scores"
        intro="Pick a player, pick a hole, tap the gross score. Everything else is calculated for you."
      />

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="glass rounded-2xl p-5">
          <Field label="Round">
            <div className="flex flex-wrap gap-2">
              {ROUNDS.map((r) => (
                <Chip key={r.no} active={roundNo === r.no} onClick={() => setRoundNo(r.no)} label={r.label} />
              ))}
            </div>
          </Field>

          <Field label="Player">
            <div className="flex flex-wrap gap-2">
              {players.map((p) => (
                <Chip
                  key={p.id}
                  active={player?.id === p.id}
                  onClick={() => setPlayerId(p.id)}
                  label={p.name}
                />
              ))}
            </div>
          </Field>

          <Field label={`Hole — ${course.name}`}>
            <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-9">
              {course.holes.map((h) => (
                <button
                  key={h.hole}
                  type="button"
                  onClick={() => setHole(h.hole)}
                  className={`rounded-lg border py-2 font-display text-lg transition-colors ${
                    hole === h.hole
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/70 bg-secondary/50 text-foreground"
                  }`}
                >
                  {h.hole}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Par {holeInfo.par} · SI {holeInfo.si} · {holeInfo.yards} yards
            </p>
          </Field>

          <Field label="Gross score">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setGross((g) => Math.max(1, g - 1))}
                className="grid size-12 place-items-center rounded-full border border-border"
                aria-label="Decrease"
              >
                <Minus className="size-5" />
              </button>
              <motion.span
                key={gross}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-display text-6xl text-gilded"
              >
                {gross}
              </motion.span>
              <button
                type="button"
                onClick={() => setGross((g) => Math.min(15, g + 1))}
                className="grid size-12 place-items-center rounded-full border border-border"
                aria-label="Increase"
              >
                <Plus className="size-5" />
              </button>
              <span className="ml-auto text-right">
                <span className="block text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                  Stableford
                </span>
                <span className="font-display text-4xl text-primary">{points}</span>
              </span>
            </div>
          </Field>

          <button
            type="button"
            disabled={save.isPending || !player}
            onClick={() => save.mutate()}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-display text-lg tracking-wider text-primary-foreground disabled:opacity-50"
          >
            <Check className="size-4" /> Save hole {hole}
          </button>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => saveAward.mutate("nearest_pin")}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-xs uppercase tracking-widest text-muted-foreground"
            >
              <Target className="size-3.5" /> Nearest the pin
            </button>
            <button
              type="button"
              onClick={() => saveAward.mutate("long_drive")}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-xs uppercase tracking-widest text-muted-foreground"
            >
              <Ruler className="size-3.5" /> Long drive
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {stats && player && (
            <div className="glass rounded-2xl p-5">
              <p className="eyebrow">{player.name} · running total</p>
              <div className="mt-3 grid grid-cols-4 gap-3 text-center">
                <Mini label="Points" value={stats.points} />
                <Mini label="Gross" value={stats.gross} />
                <Mini label="Front 9" value={stats.front9} />
                <Mini label="Back 9" value={stats.back9} />
              </div>
            </div>
          )}

          <MiniBoard title="Daily leaderboard" rows={daily} />
          <MiniBoard title="Overall leaderboard" rows={overall} />

          <div className="glass rounded-2xl p-5">
            <p className="eyebrow">Side bets</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex justify-between gap-4">
                <span className="text-muted-foreground">Nearest the pin</span>
                <span className="truncate">
                  {ntp.length ? ntp.map((a) => `${nameOf(a.player_id)} (${a.detail})`).join(", ") : "TBC"}
                </span>
              </li>
              <li className="flex justify-between gap-4">
                <span className="text-muted-foreground">Long drive</span>
                <span className="truncate">
                  {drives.length ? drives.map((a) => nameOf(a.player_id)).join(", ") : "TBC"}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="mb-2 text-[0.6rem] uppercase tracking-[0.24em] text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function Chip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm transition-colors ${
        active ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"
      }`}
    >
      {label}
    </button>
  );
}

function Mini({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-secondary/50 py-3">
      <p className="text-[0.55rem] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="font-display text-3xl text-primary">{value}</p>
    </div>
  );
}

function MiniBoard({
  title,
  rows,
}: {
  title: string;
  rows: ReturnType<typeof leaderboard>;
}) {
  return (
    <div className="glass rounded-2xl p-5">
      <p className="eyebrow">{title}</p>
      <ol className="mt-3 space-y-1.5">
        {rows.map((r) => (
          <li key={r.player.id} className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 text-sm">
            <span className="font-display text-lg text-muted-foreground">{r.position}</span>
            <span className="truncate">{r.player.name}</span>
            <span className="font-display text-xl text-primary">{r.points}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
