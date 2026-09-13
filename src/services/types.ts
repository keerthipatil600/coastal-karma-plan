import type { CoastalCity, KnowledgeEntry, PriceTier } from "@/data/knowledgeBase";

export type BudgetTier = "budget" | "mid-range" | "luxury";

export type TravelStyle =
  | "Relaxed"
  | "Balanced"
  | "Adventure"
  | "Cultural"
  | "Family"
  | "Couple"
  | "Backpacker";

export type Interest =
  | "Beaches"
  | "Temples"
  | "Food"
  | "Adventure"
  | "Nature"
  | "History"
  | "Culture"
  | "Photography"
  | "Shopping"
  | "Nightlife";

export type DietPreference = "Vegetarian" | "Non-vegetarian" | "Both";
export type TransportMode = "Bus" | "Train" | "Flight" | "Any";
export type GroupType = "Solo" | "Couple" | "Family" | "Friends";
export type StayType = "Hostel" | "Homestay" | "Hotel" | "Beach resort" | "No preference";

export interface TripRequest {
  days: number;
  startCity: CoastalCity;
  destinationPreference: CoastalCity | "Let the planner decide";
  travelDate: string;
  dailyBudgetPerPerson: number;
  budgetTier: BudgetTier;
  travelStyle: TravelStyle;
  interests: Interest[];
  diet: DietPreference;
  transport: TransportMode;
  groupType: GroupType;
  travellers: number;
  maxTravelHoursPerDay: number;
  stayType: StayType;
}

export interface PlannedActivity {
  name: string;
  city: CoastalCity;
  description: string;
  durationHours: number;
  /** Human-readable "why this recommendation?" tags. */
  reasons: string[];
  source: string;
}

export interface DayPlan {
  day: number;
  city: CoastalCity;
  travelNote?: string | undefined;
  morning: PlannedActivity[];
  afternoon: PlannedActivity[];
  evening: PlannedActivity[];
  foodPicks: KnowledgeEntry[];
  stay: KnowledgeEntry | null;
}

export interface TransportLeg {
  from: CoastalCity;
  to: CoastalCity;
  distanceKm: number;
  estimatedDurationHours: number;
  preferredMode: TransportMode;
  /** Live options are never fabricated — they stay empty until an API is configured. */
  liveOptions: never[];
  liveDataStatus: "not_configured";
  note: string;
}

export interface BudgetBreakdown {
  currency: "INR";
  perPersonPerDay: number;
  travellers: number;
  days: number;
  estimated: {
    accommodation: number;
    food: number;
    localTransport: number;
    intercityTransport: number;
    activities: number;
    misc: number;
  };
  estimatedTotal: number;
  /** Populated only from real transport/stay APIs; empty by design in Phase 1. */
  livePriced: { label: string; amount: number }[];
  notes: string[];
}

export interface Itinerary {
  request: TripRequest;
  route: CoastalCity[];
  days: DayPlan[];
  transportLegs: TransportLeg[];
  budget: BudgetBreakdown;
  retrieval: RetrievalResult;
  generation: GenerationTrace;
  map: MapRoute;
}

/* ----------------------------- RAG service ----------------------------- */

export interface RagQuery {
  text: string;
  filters?: { cities?: CoastalCity[]; tags?: string[]; priceTier?: PriceTier };
  topK?: number;
}

export interface RetrievedChunk {
  entry: KnowledgeEntry;
  score: number;
  matchedTags: string[];
}

export interface RetrievalResult {
  query: RagQuery;
  chunks: RetrievedChunk[];
  strategy: "local-lexical" | "vector-search";
  embeddingsStatus: "not_configured" | "ready";
}

export interface RagService {
  formulateQuery(request: TripRequest): RagQuery;
  embed(texts: string[]): Promise<number[][] | null>;
  vectorSearch(query: RagQuery): Promise<RetrievedChunk[] | null>;
  retrieve(query: RagQuery): Promise<RetrievalResult>;
}

/* ----------------------------- LLM service ----------------------------- */

export interface LlmPrompt {
  system: string;
  user: string;
}

export interface GenerationTrace {
  steps: { id: string; label: string; detail: string; status: "done" | "placeholder" }[];
  provider: "deterministic-local" | "llm";
  llmStatus: "not_configured" | "ready";
}

export interface LlmService {
  buildPrompt(request: TripRequest, retrieval: RetrievalResult): LlmPrompt;
  generateItineraryNarrative(prompt: LlmPrompt): Promise<string | null>;
  status(): "not_configured" | "ready";
}

/* ----------------------------- Maps service ---------------------------- */

export interface MapRoute {
  waypoints: { city: CoastalCity; lat: number; lng: number }[];
  totalDistanceKm: number;
  estimatedDrivingHours: number;
  /** Encoded polyline from a routing API; null until Maps is configured. */
  routeGeometry: string | null;
  status: "not_configured" | "ready";
}

export interface MapsService {
  getCoordinates(city: CoastalCity): { lat: number; lng: number };
  buildRoute(cities: CoastalCity[]): MapRoute;
  getRouteGeometry(cities: CoastalCity[]): Promise<string | null>;
}

/* ------------------------- Transportation services -------------------- */

export interface TransportSearchInput {
  from: CoastalCity;
  to: CoastalCity;
  date: string;
}

export interface TransportProviderResult {
  provider: "bus" | "train" | "flight";
  status: "not_configured";
  message: string;
  options: never[];
}

export interface TransportService {
  readonly provider: "bus" | "train" | "flight";
  search(input: TransportSearchInput): Promise<TransportProviderResult>;
  status(): "not_configured" | "ready";
}
