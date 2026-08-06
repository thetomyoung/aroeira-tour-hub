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
import { Leaderboard } from "@/components/leaderboard";
import { COURSES } from "@/lib/tour";
import { usePlayers, useScores, useAwards } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "2027 Golf Tour — Aroeira, Lisbon | Tournament Hub" },
      {
        name: "description",
        content:
          "The official hub for the 2027 Golf Tour at Aroeira, Lisbon. Live leaderboard, countdown, weather, agenda, courses and player profiles.",
      },
      { property: "og:title", content: "2027 Golf Tour — Aroeira, Lisbon" },
      {
        property: "og:description",
        content: "Live leaderboard, countdown, agenda and course guides for the 2027 Golf Tour in Portugal.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: players = [] } = usePlayers();
  const { data: scores = [] } = useScores();
  const { data: awards = [] } = useAwards();

  return (
    <>
      <Hero />

      <Section
        id="weather"
        eyebrow="Conditions"
        title="Aroeira Forecast"
        intro="Live conditions on the Costa da Caparica, refreshed automatically every fifteen minutes."
      >
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <WeatherCard />
          <div className="grid gap-3 sm:grid-cols-2">
            <QuickLink to="/leaderboard" icon={Trophy} title="Live Leaderboard" text="Ryder Cup style standings" />
            <QuickLink to="/scores" icon={CalendarDays} title="Enter Scores" text="Hole by hole stableford" />
            <QuickLink to="/draw" icon={Users} title="Draw Night" text="Teams, pairs and fixtures" />
            <QuickLink to="/courses" icon={CloudSun} title="Course Guide" text="Every hole, hazard and tip" />
          </div>
        </div>
      </Section>

      <Section
        id="leaderboard"
        eyebrow="Standings"
        title="Overall Leaderboard"
        intro="Points update the moment a score is entered on any phone in the group."
      >
        <Leaderboard players={players} scores={scores} round="overall" />
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
