import { COURSES, courseForRound, ROUNDS, type Hole } from "./tour";

export type Player = {
  id: string;
  name: string;
  handicap: number;
  handicap_index: number;
  photo_url: string | null;
  driving_distance: number;
  previous_wins: number;
  ryder_record: string;
  favourite_club: string;
  current_form: string;
  sort_order: number;
};

export type Score = {
  id: string;
  player_id: string;
  round_no: number;
  hole: number;
  gross: number;
};

/** Strokes received on a hole for a given playing handicap. */
export function strokesOnHole(handicap: number, si: number) {
  const h = Math.round(handicap);
  if (h <= 0) return 0;
  let strokes = Math.floor(h / 18);
  if (si <= h % 18) strokes += 1;
  return strokes;
}

export function stablefordPoints(gross: number, hole: Hole, handicap: number) {
  const nett = gross - strokesOnHole(handicap, hole.si);
  const pts = 2 + (hole.par - nett);
  return Math.max(0, pts);
}

export type PlayerRoundStats = {
  points: number;
  gross: number;
  nett: number;
  birdies: number;
  pars: number;
  eagles: number;
  holesPlayed: number;
  currentHole: number;
  front9: number;
  back9: number;
};

export function roundStats(player: Player, scores: Score[], roundNo: number): PlayerRoundStats {
  const course = courseForRound(roundNo);
  const rows = scores.filter((s) => s.player_id === player.id && s.round_no === roundNo);
  const stats: PlayerRoundStats = {
    points: 0,
    gross: 0,
    nett: 0,
    birdies: 0,
    pars: 0,
    eagles: 0,
    holesPlayed: 0,
    currentHole: 0,
    front9: 0,
    back9: 0,
  };
  for (const row of rows) {
    const hole = course.holes[row.hole - 1];
    if (!hole) continue;
    const pts = stablefordPoints(row.gross, hole, player.handicap);
    stats.points += pts;
    stats.gross += row.gross;
    stats.nett += row.gross - strokesOnHole(player.handicap, hole.si);
    if (row.gross === hole.par) stats.pars += 1;
    if (row.gross === hole.par - 1) stats.birdies += 1;
    if (row.gross <= hole.par - 2) stats.eagles += 1;
    stats.holesPlayed += 1;
    stats.currentHole = Math.max(stats.currentHole, row.hole);
    if (row.hole <= 9) stats.front9 += pts;
    else stats.back9 += pts;
  }
  return stats;
}

export type LeaderRow = PlayerRoundStats & { player: Player; position: number };

export function leaderboard(
  players: Player[],
  scores: Score[],
  roundNo: number | "overall",
): LeaderRow[] {
  const rounds = roundNo === "overall" ? ROUNDS.map((r) => r.no) : [roundNo];
  const rows = players.map((player) => {
    const merged = rounds
      .map((r) => roundStats(player, scores, r))
      .reduce<PlayerRoundStats>(
        (acc, s) => ({
          points: acc.points + s.points,
          gross: acc.gross + s.gross,
          nett: acc.nett + s.nett,
          birdies: acc.birdies + s.birdies,
          pars: acc.pars + s.pars,
          eagles: acc.eagles + s.eagles,
          holesPlayed: acc.holesPlayed + s.holesPlayed,
          currentHole: Math.max(acc.currentHole, s.currentHole),
          front9: acc.front9 + s.front9,
          back9: acc.back9 + s.back9,
        }),
        {
          points: 0,
          gross: 0,
          nett: 0,
          birdies: 0,
          pars: 0,
          eagles: 0,
          holesPlayed: 0,
          currentHole: 0,
          front9: 0,
          back9: 0,
        },
      );
    return { ...merged, player, position: 0 };
  });

  rows.sort((a, b) => b.points - a.points || a.gross - b.gross || a.player.name.localeCompare(b.player.name));
  let lastPoints: number | null = null;
  let lastPos = 0;
  rows.forEach((row, i) => {
    if (row.points === lastPoints) row.position = lastPos;
    else {
      row.position = i + 1;
      lastPos = row.position;
      lastPoints = row.points;
    }
  });
  return rows;
}

export const totalPar = (courseId: string) =>
  COURSES.find((c) => c.id === courseId)?.holes.reduce((a, h) => a + h.par, 0) ?? 72;
