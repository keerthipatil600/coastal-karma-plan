import { createFileRoute, Link } from "@tanstack/react-router";
import { COASTAL_ROUTE } from "@/data/knowledgeBase";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Coastal Karnataka Smart Travel Planner" },
      {
        name: "description",
        content:
          "Plan smarter along the Karnataka coast. Personalised day-by-day itineraries from Mangaluru to Karwar built around your budget, interests and travel style.",
      },
      { property: "og:title", content: "Coastal Karnataka Smart Travel Planner" },
      {
        property: "og:description",
        content:
          "Personalised coastal itineraries from Mangaluru to Karwar — beaches, temples, seafood and routes matched to how you travel.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const STEPS = [
  {
    title: "Tell us how you travel",
    body: "Days, starting city, budget tier, travel style, interests, diet and transport preference.",
  },
  {
    title: "We search a curated coast",
    body: "A structured knowledge base of attractions, dining, stays and en-route notes for the Mangaluru–Karwar corridor.",
  },
  {
    title: "You get a day-by-day plan",
    body: "Morning, afternoon and evening blocks with stays, food picks, route legs and a transparent budget estimate.",
  },
];

function Index() {
  return (
    <main className="min-h-screen bg-background">
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:py-28">
          <p className="text-sm uppercase tracking-[0.2em] text-gold">Mangaluru → Karwar</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            Coastal Karnataka Smart Travel Planner
          </h1>
          <p className="mt-5 max-w-xl text-lg text-primary-foreground/85">
            Plan smarter. Explore more. Travel your way.
          </p>
          <Link
            to="/plan"
            className="mt-9 inline-block rounded-full bg-accent px-8 py-4 font-display text-lg font-semibold text-accent-foreground shadow-lg transition hover:brightness-95"
          >
            Plan My Trip
          </Link>
          <div className="mt-12 flex flex-wrap items-center gap-2 text-sm">
            {COASTAL_ROUTE.map((city, index) => (
              <span key={city} className="flex items-center gap-2">
                <span className="rounded-full bg-secondary/50 px-3 py-1">{city}</span>
                {index < COASTAL_ROUTE.length - 1 && <span className="text-gold">→</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-3xl font-semibold text-primary">
          AI-assisted itineraries, built for one coastline
        </h2>
        <p className="mt-4 max-w-3xl text-muted-foreground">
          Instead of generic lists, the planner retrieves relevant, source-attributed knowledge about
          the Karnataka coast — Mangaluru, Udupi, Murudeshwar, Gokarna and Karwar — then shapes it
          into a realistic day-by-day route for your pace, budget and interests. Every suggestion
          carries a short explanation of why it was chosen, and cost figures are clearly labelled as
          planning estimates.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <article key={step.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <span className="font-display text-2xl text-gold">0{index + 1}</span>
              <h3 className="mt-2 font-display text-lg font-semibold text-primary">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 rounded-2xl border border-dashed border-border bg-sand p-6">
          <h3 className="font-display text-lg font-semibold text-primary">
            Honest about what is connected
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Live transportation data, live room rates and map routing appear only once those APIs are
            configured. Nothing is simulated and no bookings are made.
          </p>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        Coastal Karnataka Smart Travel Planner · Phase 1
      </footer>
    </main>
  );
}
