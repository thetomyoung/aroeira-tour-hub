import type { Player } from "./golf";
import { ROUNDS } from "./tour";

export type RoundTotal = {
  id: string;
  player_id: string;
  round_no: number;
  points: number;
};

export type StandingRow = {
  player: Player;
  position: number;
  total: number;
  played: number;
  best: number;
  average: number;
  byRound: Record<number, number | undefined>;
  latest: number | undefined;
  movement: number; // positive = climbed places since previous round
};

const ROUND_NOS = ROUNDS.map((r) => r.no);

function rank(values: { id: string; total: number; name: string }[]) {
  const sorted = [...values].sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
  const map = new Map<string, number>();
  let lastTotal: number | null = null;
  let lastPos = 0;
  sorted.forEach((v, i) => {
    const pos = v.total === lastTotal ? lastPos : i + 1;
    lastTotal = v.total;
    lastPos = pos;
    map.set(v.id, pos);
  });
  return map;
}

/** Highest round number that has at least one entered total. */
export function latestRound(totals: RoundTotal[]) {
  return totals.reduce((max, t) => Math.max(max, t.round_no), 0);
}

function totalsThrough(players: Player[], totals: RoundTotal[], through: number) {
  return players.map((p) => ({
    id: p.id,
    name: p.name,
    total: totals
      .filter((t) => t.player_id === p.id && t.round_no <= through)
      .reduce((a, t) => a + t.points, 0),
  }));
}

export function standings(
  players: Player[],
  totals: RoundTotal[],
  scope: number | "overall" = "overall",
): StandingRow[] {
  const rounds = scope === "overall" ? ROUND_NOS : [scope];
  const current = latestRound(totals);
  const prevRank = current > 1 && scope === "overall" ? rank(totalsThrough(players, totals, current - 1)) : null;

  const rows = players.map((player) => {
    const mine = totals.filter((t) => t.player_id === player.id && rounds.includes(t.round_no));
    const byRound: Record<number, number | undefined> = {};
    for (const t of mine) byRound[t.round_no] = t.points;
    const total = mine.reduce((a, t) => a + t.points, 0);
    const played = mine.length;
    return {
      player,
      position: 0,
      total,
      played,
      best: mine.reduce((a, t) => Math.max(a, t.points), 0),
      average: played ? Math.round((total / played) * 10) / 10 : 0,
      byRound,
      latest: totals.find((t) => t.player_id === player.id && t.round_no === current)?.points,
      movement: 0,
    } satisfies StandingRow;
  });

  const nowRank = rank(rows.map((r) => ({ id: r.player.id, total: r.total, name: r.player.name })));
  for (const row of rows) {
    row.position = nowRank.get(row.player.id) ?? 0;
    const before = prevRank?.get(row.player.id);
    row.movement = before ? before - row.position : 0;
  }
  rows.sort((a, b) => a.position - b.position || a.player.name.localeCompare(b.player.name));
  return rows;
}

export type Insights = {
  climber: StandingRow | null;
  average: number;
  bestRound: { row: StandingRow; points: number; round: number } | null;
  gap: number;
  playerOfTheDay: { row: StandingRow; points: number } | null;
  roundsPlayed: number;
};

export function insights(rows: StandingRow[], totals: RoundTotal[]): Insights {
  const played = rows.filter((r) => r.played > 0);
  const current = latestRound(totals);

  const climber = played.reduce<StandingRow | null>(
    (best, r) => (r.movement > 0 && (!best || r.movement > best.movement) ? r : best),
    null,
  );

  const totalPoints = played.reduce((a, r) => a + r.total, 0);
  const totalRounds = played.reduce((a, r) => a + r.played, 0);
  const average = totalRounds ? Math.round((totalPoints / totalRounds) * 10) / 10 : 0;

  let bestRound: Insights["bestRound"] = null;
  for (const row of played) {
    for (const [round, pts] of Object.entries(row.byRound)) {
      if (pts != null && (!bestRound || pts > bestRound.points)) {
        bestRound = { row, points: pts, round: Number(round) };
      }
    }
  }

  const top = played.slice(0, 3);
  const gap = top.length >= 2 ? top[0]!.total - top[top.length - 1]!.total : 0;

  let playerOfTheDay: Insights["playerOfTheDay"] = null;
  for (const row of played) {
    const pts = row.byRound[current];
    if (pts != null && (!playerOfTheDay || pts > playerOfTheDay.points)) {
      playerOfTheDay = { row, points: pts };
    }
  }

  return { climber, average, bestRound, gap, playerOfTheDay, roundsPlayed: current };
}
