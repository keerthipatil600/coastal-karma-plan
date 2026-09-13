import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ItineraryResults } from "@/components/ItineraryResults";
import { TripForm } from "@/components/TripForm";
import { generateItinerary } from "@/services/itineraryService";
import type { Itinerary, TripRequest } from "@/services/types";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [
      { title: "Plan a Coastal Karnataka Trip — Smart Travel Planner" },
      {
        name: "description",
        content:
          "Build a personalised day-by-day Coastal Karnataka itinerary from Mangaluru to Karwar with budget, style, interests and transport preferences.",
      },
      { property: "og:title", content: "Plan a Coastal Karnataka Trip" },
      {
        property: "og:description",
        content:
          "Answer a few questions and get a day-by-day coastal itinerary with stays, food picks and a budget estimate.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlanPage,
});

function PlanPage() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (request: TripRequest) => {
    setSubmitting(true);
    try {
      const result = await generateItinerary(request);
      setItinerary(result);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:py-16">
      <Link to="/" className="text-sm text-secondary hover:underline">
        ← Back to home
      </Link>

      {itinerary ? (
        <>
          <header className="mt-6 mb-8">
            <h1 className="font-display text-3xl font-semibold text-primary sm:text-4xl">
              Your {itinerary.request.days}-day coastal itinerary
            </h1>
            <p className="mt-2 text-muted-foreground">
              {itinerary.request.travelStyle} pace · {itinerary.request.groupType} ·{" "}
              {itinerary.request.budgetTier} budget · starting {itinerary.request.startCity}
            </p>
            <button
              type="button"
              onClick={() => setItinerary(null)}
              className="mt-4 rounded-full border border-border px-5 py-2 text-sm text-primary transition hover:border-secondary"
            >
              Edit preferences
            </button>
          </header>
          <ItineraryResults itinerary={itinerary} />
        </>
      ) : (
        <>
          <header className="mt-6 mb-8">
            <h1 className="font-display text-3xl font-semibold text-primary sm:text-4xl">
              Plan my trip
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Tell us how you like to travel along the Mangaluru–Karwar coast. Everything is a
              planning estimate — no bookings are made and no live prices are shown.
            </p>
          </header>
          <TripForm onSubmit={handleSubmit} submitting={submitting} />
        </>
      )}
    </main>
  );
}
