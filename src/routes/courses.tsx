import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/section";
import { CourseCard } from "@/components/course-card";
import { COURSES } from "@/lib/tour";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Course Guide — Aroeira Pines & Challenge | SBF Golf Tour 2027" },
      {
        name: "description",
        content: "Interactive hole-by-hole maps, ratings, slope and yardages for the Aroeira Pines Classic and Aroeira Challenge courses.",
      },
      { property: "og:title", content: "Course Guide — Aroeira Pines & Challenge" },
      { property: "og:description", content: "Every hole with distances, hazards, green layout and local tips." },
    ],
  }),
  component: CoursesPage,
});

function CoursesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Course Guide"
        title="Know The Ground"
        intro="Tap any hole number for distances, hazards, green layout and a local tip."
      />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-2">
        {COURSES.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>
    </>
  );
}
