import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PageHeader } from "@/components/section";
import { usePlayers, useScores } from "@/lib/data";
import { courseForRound, ROUNDS } from "@/lib/tour";
import { stablefordPoints, strokesOnHole } from "@/lib/golf";

export const Route = createFileRoute("/scorecards")({
  head: () => ({
    meta: [
      { title: "Player Scorecards — 2027 Golf Tour, Aroeira" },
      {
        name: "description",
        content: "Interactive hole-by-hole scorecards for every player on the 2027 Golf Tour, exportable as PDF.",
      },
      { property: "og:title", content: "Player Scorecards — 2027 Golf Tour" },
      { property: "og:description", content: "Par, stroke index, gross, stableford and running totals for every round." },
    ],
  }),
  component: ScorecardsPage,
});

function ScorecardsPage() {
  const { data: players = [] } = usePlayers();
  const { data: scores = [] } = useScores();
  const [roundNo, setRoundNo] = useState(1);
  const [playerId, setPlayerId] = useState<string | null>(null);

  const player = players.find((p) => p.id === playerId) ?? players[0];
  const course = courseForRound(roundNo);

  const rows = course.holes.map((h) => {
    const gross = scores.find(
      (s) => s.player_id === player?.id && s.round_no === roundNo && s.hole === h.hole,
    )?.gross;
    const pts = gross && player ? stablefordPoints(gross, h, player.handicap) : null;
    return { hole: h, gross: gross ?? null, points: pts, shots: player ? strokesOnHole(player.handicap, h.si) : 0 };
  });

  let running = 0;
  const withTotals = rows.map((r) => {
    running += r.points ?? 0;
    return { ...r, running };
  });

  function exportPdf() {
    if (!player) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`${player.name} — ${course.name}`, 14, 18);
    doc.setFontSize(10);
    doc.text(`Round ${roundNo} · Handicap ${player.handicap} · 2027 Golf Tour, Aroeira`, 14, 25);
    autoTable(doc, {
      startY: 32,
      head: [["Hole", "Par", "SI", "Shots", "Gross", "Stableford", "Running"]],
      body: withTotals.map((r) => [
        r.hole.hole,
        r.hole.par,
        r.hole.si,
        r.shots,
        r.gross ?? "-",
        r.points ?? "-",
        r.running,
      ]),
      theme: "grid",
      headStyles: { fillColor: [20, 45, 33] },
    });
    doc.save(`${player.name}-round-${roundNo}.pdf`);
  }

  return (
    <>
      <PageHeader eyebrow="Cards" title="Scorecards" intro="Every hole, every point, ready to export." />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-4 flex flex-wrap gap-2">
          {ROUNDS.map((r) => (
            <button
              key={r.no}
              type="button"
              onClick={() => setRoundNo(r.no)}
              className={`rounded-full px-5 py-2 font-display tracking-wider ${
                roundNo === r.no ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <div className="mb-6 flex flex-wrap gap-2">
          {players.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlayerId(p.id)}
              className={`rounded-full px-4 py-2 text-sm ${
                player?.id === p.id ? "bg-secondary text-foreground" : "border border-border text-muted-foreground"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {player && (
          <div className="glass overflow-hidden rounded-2xl">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border/60 p-5">
              <div className="min-w-0">
                <p className="eyebrow">{course.name}</p>
                <p className="truncate font-display text-3xl text-gilded">{player.name}</p>
              </div>
              <button
                type="button"
                onClick={exportPdf}
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-display tracking-wider text-primary-foreground"
              >
                <Download className="size-4" /> PDF
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[38rem] text-sm">
                <thead>
                  <tr className="border-b border-border/70 text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                    <th className="px-4 py-3 text-left">Hole</th>
                    <th className="px-3 py-3 text-right">Par</th>
                    <th className="px-3 py-3 text-right">SI</th>
                    <th className="px-3 py-3 text-right">Shots</th>
                    <th className="px-3 py-3 text-right">Gross</th>
                    <th className="px-3 py-3 text-right">Stableford</th>
                    <th className="px-4 py-3 text-right">Running</th>
                  </tr>
                </thead>
                <tbody>
                  {withTotals.map((r) => (
                    <tr key={r.hole.hole} className="border-b border-border/40">
                      <td className="px-4 py-2.5 font-display text-lg">{r.hole.hole}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums">{r.hole.par}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground">{r.hole.si}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground">{r.shots}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums">{r.gross ?? "–"}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-primary">{r.points ?? "–"}</td>
                      <td className="px-4 py-2.5 text-right font-display text-lg">{r.running}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
