import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, CloudSun, Trophy, Users } from "lucide-react";
import { Hero } from "@/components/hero";
import { Section, Reveal } from "@/components/section";
import { WeatherCard } from "@/components/weather-card";
import { AgendaTimeline } from "@/components/agenda-timeline";
import { Accommodation } from "@/components/accommodation";
import { CourseCard } from "@/components/course-card";
import { PlayerCards } from "@/components/player-cards";
import { StatsGrid } from "@/components/stats-grid";
import { RacePodium } from "@/components/podium";
import { TournamentBoard } from "@/components/tournament-board";
import { COURSES } from "@/lib/tour";
import { usePlayers, useScores, useAwards, useRoundTotals } from "@/lib/data";
import { standings } from "@/lib/tournament";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SBF Golf Tour 2027 – Lisbon | Tournament Hub" },
      {
        name: "description",
        content:
          "The official hub for the SBF Golf Tour 2027 at Aroeira, Lisbon. Race to Lisbon podium, Stableford leaderboard, countdown, weather, agenda and courses.",
      },
      { property: "og:title", content: "SBF Golf Tour 2027 – Lisbon" },
      {
        property: "og:description",
        content: "Race to Lisbon podium, Stableford standings, countdown and course guides for the SBF Golf Tour 2027.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: players = [] } = usePlayers();
  const { data: scores = [] } = useScores();
  const { data: awards = [] } = useAwards();
  const { data: roundTotals = [] } = useRoundTotals();
  const rows = standings(players, roundTotals, "overall");

  return (
    <>
      <Hero />

      <Section
        id="hub"
        eyebrow="Tournament Hub"
        title="Jump Straight In"
        intro="Everything you need for the week, one tap away."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickLink to="/leaderboard" icon={Trophy} title="Live Leaderboard" text="Ryder Cup style standings" />
          <QuickLink to="/scores" icon={CalendarDays} title="Enter Scores" text="One total per player" />
          <QuickLink to="/draw" icon={Users} title="Draw Night" text="Teams, pairs and fixtures" />
          <QuickLink to="/courses" icon={CloudSun} title="Course Guide" text="Every hole, hazard and tip" />
        </div>
      </Section>

      <Section
        id="leaderboard"
        eyebrow="Standings"
        title="Overall Leaderboard"
        intro="Golf GameBook scores each round; the organiser posts one Stableford total per player and the podium re-shuffles."
      >
        <div className="space-y-6">
          <RacePodium rows={rows} />
          <TournamentBoard rows={rows} scope="overall" />
        </div>
      </Section>

      <Section
        id="agenda"
        eyebrow="Itinerary"
        title="Four Days in Portugal"
        intro="Tap any day to open the running order."
      >
        <AgendaTimeline />
      </Section>

      <Section id="stay" eyebrow="Accommodation" title="Aroeira Lisbon Hotel">
        <Accommodation />
      </Section>

      <Section
        id="courses"
        eyebrow="The Battleground"
        title="Two Championship Courses"
        intro="Pennink's pines and Steel's water. Three rounds, one trophy."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {COURSES.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </Section>

      <Section id="players" eyebrow="The Field" title="Players">
        <PlayerCards players={players} />
      </Section>

      <Section id="stats" eyebrow="Numbers" title="Tour Statistics">
        <StatsGrid players={players} scores={scores} awards={awards} />
      </Section>

      <Section
        id="weather"
        eyebrow="Conditions"
        title="Aroeira Forecast"
        intro="Live conditions on the Costa da Caparica, refreshed automatically every fifteen minutes."
      >
        <WeatherCard />
      </Section>
    </>
  );
}

function QuickLink({
  to,
  icon: Icon,
  title,
  text,
}: {
  to: "/leaderboard" | "/scores" | "/draw" | "/courses";
  icon: typeof Trophy;
  title: string;
  text: string;
}) {
  return (
    <Reveal>
      <Link to={to} className="glass block h-full rounded-2xl p-5 transition-transform hover:scale-[1.02]">
        <Icon className="size-5 text-primary" strokeWidth={1.5} />
        <p className="mt-4 font-display text-2xl leading-none tracking-wide">{title}</p>
        <p className="mt-2 text-xs text-muted-foreground">{text}</p>
      </Link>
    </Reveal>
  );
}
