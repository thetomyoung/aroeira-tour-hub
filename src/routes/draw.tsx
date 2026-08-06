import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Shuffle, Crown, Swords, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/section";
import { usePlayers, useTeams, useFixtures } from "@/lib/data";
import { ROUNDS } from "@/lib/tour";

export const Route = createFileRoute("/draw")({
  head: () => ({
    meta: [
      { title: "Draw Night — 2027 Golf Tour, Aroeira" },
      {
        name: "description",
        content: "Pick captains, draw the teams and generate fourball matchplay fixtures for the 2027 Golf Tour at Aroeira.",
      },
      { property: "og:title", content: "Draw Night — 2027 Golf Tour" },
      { property: "og:description", content: "Captains, teams, pairs and matchplay fixtures for the trip." },
    ],
  }),
  component: DrawPage,
});

const TEAM_A = "Team Pines";
const TEAM_B = "Team Atlantic";

function DrawPage() {
  const qc = useQueryClient();
  const { data: players = [] } = usePlayers();
  const { data: teams = [] } = useTeams();
  const { data: fixtures = [] } = useFixtures();
  const [captains, setCaptains] = useState<string[]>([]);
  const [spinning, setSpinning] = useState(false);

  const teamOf = (id: string) => teams.find((t) => t.player_id === id)?.team;
  const sideA = players.filter((p) => teamOf(p.id) === TEAM_A);
  const sideB = players.filter((p) => teamOf(p.id) === TEAM_B);

  const saveDraw = useMutation({
    mutationFn: async (rows: { player_id: string; team: string; is_captain: boolean }[]) => {
      await supabase.from("teams").delete().neq("player_id", "00000000-0000-0000-0000-000000000000");
      const { error } = await supabase.from("teams").insert(rows);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["teams"] });
      toast.success("Draw saved for the whole group");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const saveFixtures = useMutation({
    mutationFn: async () => {
      await supabase.from("fixtures").delete().gte("sort_order", 0);
      const a = [...sideA];
      const b = [...sideB];
      const rows: {
        round_no: number;
        format: string;
        side_a: string[];
        side_b: string[];
        tee_time: string;
        sort_order: number;
      }[] = [];
      let order = 0;
      for (const round of ROUNDS) {
        for (let i = 0; i < Math.floor(Math.min(a.length, b.length) / 2); i++) {
          rows.push({
            round_no: round.no,
            format: "Fourball Matchplay",
            side_a: [a[i * 2]?.name ?? "TBC", a[i * 2 + 1]?.name ?? "TBC"],
            side_b: [b[i * 2]?.name ?? "TBC", b[i * 2 + 1]?.name ?? "TBC"],
            tee_time: offsetTee(round.tee, i),
            sort_order: order++,
          });
        }
      }
      if (!rows.length) throw new Error("Draw the teams first");
      const { error } = await supabase.from("fixtures").insert(rows);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["fixtures"] });
      toast.success("Fixtures generated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function randomDraw() {
    if (players.length < 2) return;
    setSpinning(true);
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    const caps = captains.length === 2 ? captains : [shuffled[0]!.id, shuffled[1]!.id];
    const rest = shuffled.filter((p) => !caps.includes(p.id));
    const rows = [
      { player_id: caps[0]!, team: TEAM_A, is_captain: true },
      { player_id: caps[1]!, team: TEAM_B, is_captain: true },
      ...rest.map((p, i) => ({
        player_id: p.id,
        team: i % 2 === 0 ? TEAM_A : TEAM_B,
        is_captain: false,
      })),
    ];
    setCaptains(caps);
    setTimeout(() => {
      saveDraw.mutate(rows);
      setSpinning(false);
    }, 700);
  }

  function movePlayer(playerId: string, team: string) {
    const rows = players.map((p) => ({
      player_id: p.id,
      team: p.id === playerId ? team : (teamOf(p.id) ?? TEAM_A),
      is_captain: captains.includes(p.id),
    }));
    saveDraw.mutate(rows);
  }

  return (
    <>
      <PageHeader
        eyebrow="Draw Night"
        title="The Draw"
        intro="Choose your two captains, spin the draw and the fourball matchplay fixtures write themselves."
      />

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6">
        <div className="glass rounded-2xl p-5">
          <p className="eyebrow">Captains — pick two</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {players.map((p) => {
              const on = captains.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() =>
                    setCaptains((c) =>
                      on ? c.filter((x) => x !== p.id) : c.length < 2 ? [...c, p.id] : c,
                    )
                  }
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors ${
                    on ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"
                  }`}
                >
                  {on && <Crown className="size-3.5" />}
                  {p.name}
                </button>
              );
            })}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={randomDraw}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-display text-lg tracking-wider text-primary-foreground"
            >
              <motion.span animate={spinning ? { rotate: 720 } : { rotate: 0 }} transition={{ duration: 0.7 }}>
                <Shuffle className="size-4" />
              </motion.span>
              Random draw
            </button>
            <button
              type="button"
              onClick={() => saveFixtures.mutate()}
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 font-display text-lg tracking-wider text-muted-foreground"
            >
              <Save className="size-4" /> Generate fixtures
            </button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {[
            { name: TEAM_A, list: sideA, other: TEAM_B },
            { name: TEAM_B, list: sideB, other: TEAM_A },
          ].map((team) => (
            <motion.div
              key={team.name}
              layout
              className="glass-gold rounded-2xl p-5"
            >
              <p className="font-display text-3xl text-gilded">{team.name}</p>
              <ul className="mt-4 space-y-2">
                {team.list.map((p) => (
                  <motion.li
                    key={p.id}
                    layout
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-secondary/50 px-4 py-2.5"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      {teams.find((t) => t.player_id === p.id)?.is_captain && (
                        <Crown className="size-3.5 shrink-0 text-primary" />
                      )}
                      <span className="truncate text-sm">{p.name}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => movePlayer(p.id, team.other)}
                      className="shrink-0 text-[0.6rem] uppercase tracking-widest text-muted-foreground hover:text-primary"
                    >
                      Move
                    </button>
                  </motion.li>
                ))}
                {!team.list.length && <li className="text-sm text-muted-foreground">Awaiting the draw…</li>}
              </ul>
            </motion.div>
          ))}
        </div>

        <div>
          <p className="eyebrow mb-3">Matchplay fixtures</p>
          <div className="grid gap-3 md:grid-cols-2">
            {fixtures.map((f, i) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.4) }}
                className="glass rounded-2xl p-4"
              >
                <div className="flex items-center justify-between text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                  <span>
                    Round {f.round_no} · {f.format}
                  </span>
                  <span>{f.tee_time}</span>
                </div>
                <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
                  <p className="truncate text-sm">{f.side_a.join(" & ")}</p>
                  <Swords className="size-4 shrink-0 text-primary" />
                  <p className="truncate text-right text-sm">{f.side_b.join(" & ")}</p>
                </div>
                {f.result && <p className="mt-2 text-center font-display text-xl text-primary">{f.result}</p>}
              </motion.div>
            ))}
            {!fixtures.length && (
              <p className="text-sm text-muted-foreground">No fixtures yet — run the draw, then generate.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function offsetTee(tee: string, i: number) {
  const [h, m] = tee.split(":").map(Number);
  const total = (h ?? 12) * 60 + (m ?? 0) + i * 10;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}
