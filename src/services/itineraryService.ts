import {
  COASTAL_ROUTE,
  entriesForCity,
  type CoastalCity,
  type KnowledgeEntry,
} from "@/data/knowledgeBase";
import { buildBudget } from "./budgetService";
import { llmService } from "./llmService";
import { legDistanceKm, mapsService } from "./mapsService";
import { ragService } from "./ragService";
import type {
  DayPlan,
  GenerationTrace,
  Itinerary,
  PlannedActivity,
  RetrievalResult,
  TransportLeg,
  TripRequest,
} from "./types";

function interestTags(request: TripRequest) {
  return new Set(request.interests.map((i) => i.toLowerCase()));
}

function buildRoute(request: TripRequest): CoastalCity[] {
  const startIndex = COASTAL_ROUTE.indexOf(request.startCity);
  const forward = COASTAL_ROUTE.slice(startIndex);
  const backward = COASTAL_ROUTE.slice(0, startIndex + 1).reverse();

  let corridor = forward.length >= backward.length ? forward : backward;

  if (request.destinationPreference !== "Let the planner decide") {
    const destIndex = COASTAL_ROUTE.indexOf(request.destinationPreference);
    const [lo, hi] = startIndex <= destIndex ? [startIndex, destIndex] : [destIndex, startIndex];
    const slice = COASTAL_ROUTE.slice(lo, hi + 1);
    corridor = startIndex <= destIndex ? slice : [...slice].reverse();
  }

  // Pace: relaxed styles cover fewer towns, adventurous styles cover more.
  const nightsPerTown = request.travelStyle === "Relaxed" || request.groupType === "Family" ? 2 : 1;
  const maxTowns = Math.max(1, Math.min(corridor.length, Math.ceil(request.days / nightsPerTown)));
  return corridor.slice(0, maxTowns);
}

function distributeDays(route: CoastalCity[], days: number): CoastalCity[] {
  const perTown = Math.floor(days / route.length);
  const remainder = days % route.length;
  const schedule: CoastalCity[] = [];
  route.forEach((city, index) => {
    const count = perTown + (index < remainder ? 1 : 0);
    for (let i = 0; i < Math.max(count, 0); i += 1) schedule.push(city);
  });
  while (schedule.length < days) schedule.push(route[route.length - 1]!);
  return schedule.slice(0, days);
}

function reasonsFor(entry: KnowledgeEntry, request: TripRequest, tags: Set<string>) {
  const reasons: string[] = [];
  const matched = entry.tags.filter((tag) => tags.has(tag));
  if (matched.length) reasons.push(`Matches your interest in ${matched.join(", ")}`);
  if (entry.priceTier === "budget" && request.budgetTier === "budget")
    reasons.push("Fits a budget-friendly day");
  if (entry.priceTier === "luxury" && request.budgetTier === "luxury")
    reasons.push("Premium pick for a luxury tier trip");
  if ((entry.rating ?? 0) >= 4.5) reasons.push(`Highly rated (${entry.rating})`);
  if (entry.tags.includes("family") && request.groupType === "Family")
    reasons.push("Works well for families");
  if (entry.tags.includes("couple") && request.groupType === "Couple")
    reasons.push("Good for couples");
  if (entry.tags.includes("backpacker") && request.travelStyle === "Backpacker")
    reasons.push("Backpacker favourite");
  if (!reasons.length) reasons.push(`Signature ${entry.city} experience`);
  return reasons.slice(0, 3);
}

function toActivity(
  entry: KnowledgeEntry,
  request: TripRequest,
  tags: Set<string>,
  durationHours: number,
): PlannedActivity {
  return {
    name: entry.name,
    city: entry.city,
    description: entry.description,
    durationHours,
    reasons: reasonsFor(entry, request, tags),
    source: entry.source,
  };
}

function scoreEntry(entry: KnowledgeEntry, tags: Set<string>) {
  return entry.tags.filter((t) => tags.has(t)).length + (entry.rating ?? 4) / 10;
}

function pickFood(city: CoastalCity, request: TripRequest) {
  const all = entriesForCity(city, "dining");
  const filtered = all.filter((entry) => {
    if (request.diet === "Vegetarian") return entry.tags.includes("vegetarian");
    if (request.diet === "Non-vegetarian")
      return entry.tags.includes("seafood") || entry.tags.includes("non-vegetarian");
    return true;
  });
  return (filtered.length ? filtered : all).slice(0, 2);
}

function pickStay(city: CoastalCity, request: TripRequest) {
  const stays = entriesForCity(city, "stay");
  if (!stays.length) return null;
  const wanted = request.stayType.toLowerCase();
  const preferred = stays.filter(
    (s) =>
      s.tags.some((t) => wanted.includes(t)) ||
      (request.budgetTier === "budget" && s.priceTier === "budget") ||
      (request.budgetTier === "luxury" && s.priceTier === "luxury"),
  );
  return (preferred[0] ?? stays[0]) ?? null;
}

function buildDays(request: TripRequest, route: CoastalCity[]): DayPlan[] {
  const tags = interestTags(request);
  const schedule = distributeDays(route, request.days);
  const used = new Set<string>();

  return schedule.map((city, index) => {
    const previous = index === 0 ? request.startCity : schedule[index - 1]!;
    const attractions = entriesForCity(city, "attraction")
      .sort((a, b) => scoreEntry(b, tags) - scoreEntry(a, tags))
      .filter((entry) => !used.has(entry.id));

    const perDay = request.travelStyle === "Relaxed" ? 2 : request.travelStyle === "Adventure" ? 4 : 3;
    const chosen = attractions.slice(0, perDay);
    chosen.forEach((entry) => used.add(entry.id));

    const fallback = entriesForCity(city, "attraction");
    const slots = chosen.length ? chosen : fallback.slice(0, 2);

    const enroute = entriesForCity(city, "enroute")[0];
    const travelNote =
      previous !== city
        ? enroute
          ? `${previous} → ${city}: ${enroute.description}`
          : `Travel day from ${previous} to ${city} (about ${legDistanceKm(previous, city)} km).`
        : undefined;

    const morning = slots.slice(0, 1).map((e) => toActivity(e, request, tags, 3));
    const afternoon = slots.slice(1, 2).map((e) => toActivity(e, request, tags, 2.5));
    const evening = slots.slice(2).map((e) => toActivity(e, request, tags, 2));

    return {
      day: index + 1,
      city,
      travelNote,
      morning,
      afternoon: afternoon.length ? afternoon : morning.slice(0, 0),
      evening,
      foodPicks: pickFood(city, request),
      stay: pickStay(city, request),
    };
  });
}

function buildLegs(request: TripRequest, route: CoastalCity[]): TransportLeg[] {
  const legs: TransportLeg[] = [];
  for (let i = 0; i < route.length - 1; i += 1) {
    const from = route[i]!;
    const to = route[i + 1]!;
    const distanceKm = legDistanceKm(from, to);
    legs.push({
      from,
      to,
      distanceKm,
      estimatedDurationHours: Math.round((distanceKm / 40) * 10) / 10,
      preferredMode: request.transport,
      liveOptions: [],
      liveDataStatus: "not_configured",
      note: "Live transportation data will appear once the transportation API is configured.",
    });
  }
  return legs;
}

function buildTrace(retrieval: RetrievalResult): GenerationTrace {
  return {
    provider: "deterministic-local",
    llmStatus: llmService.status(),
    steps: [
      {
        id: "preferences",
        label: "User Preferences",
        detail: "Your form answers are normalised into a structured trip brief.",
        status: "done",
      },
      {
        id: "semantic-search",
        label: "Semantic Search",
        detail:
          retrieval.strategy === "vector-search"
            ? "Vector search over the Coastal Karnataka knowledge base."
            : "Interest-weighted retrieval over the knowledge base. Embeddings and vector search are not connected yet.",
        status: retrieval.strategy === "vector-search" ? "done" : "placeholder",
      },
      {
        id: "retrieval",
        label: "Relevant Travel Info",
        detail: `${retrieval.chunks.length} curated attractions, dining spots, stays and en-route notes retrieved.`,
        status: "done",
      },
      {
        id: "llm",
        label: "LLM Personalisation",
        detail:
          "Prompt is built and ready. Model output is not used until a language model is configured.",
        status: "placeholder",
      },
      {
        id: "route",
        label: "Route Calculation",
        detail: "Coastal corridor sequencing with dataset distances and pacing rules.",
        status: "done",
      },
      {
        id: "transport",
        label: "Transport Info",
        detail: "Inter-city legs prepared; live schedules await a transportation API.",
        status: "placeholder",
      },
      {
        id: "final",
        label: "Final Itinerary",
        detail: "Day-by-day plan, stays, food picks and budget estimate assembled.",
        status: "done",
      },
    ],
  };
}

/** Itinerary service: orchestrates RAG, LLM, maps, transport and budget. */
export async function generateItinerary(request: TripRequest): Promise<Itinerary> {
  const query = ragService.formulateQuery(request);
  const retrieval = await ragService.retrieve(query);
  const prompt = llmService.buildPrompt(request, retrieval);
  await llmService.generateItineraryNarrative(prompt);

  const route = buildRoute(request);
  const days = buildDays(request, route);
  const transportLegs = buildLegs(request, route);
  const budget = buildBudget(request, transportLegs);
  const map = mapsService.buildRoute(route);

  return {
    request,
    route,
    days,
    transportLegs,
    budget,
    retrieval,
    generation: buildTrace(retrieval),
    map,
  };
}
