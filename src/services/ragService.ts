import { KNOWLEDGE_BASE, type CoastalCity } from "@/data/knowledgeBase";
import type {
  RagQuery,
  RagService,
  RetrievalResult,
  RetrievedChunk,
  TripRequest,
} from "./types";

/**
 * RAG service.
 *
 * The interface is the real contract: query formulation -> embeddings ->
 * vector search -> semantic retrieval. Embeddings and vector search are not
 * connected in Phase 1, so `embed` and `vectorSearch` return null and
 * retrieval falls back to transparent local lexical scoring over the
 * curated knowledge base. Nothing is fabricated.
 */

function tagsFromRequest(request: TripRequest): string[] {
  const tags = request.interests.map((i) => i.toLowerCase());
  tags.push(request.travelStyle.toLowerCase(), request.groupType.toLowerCase());
  if (request.diet === "Vegetarian") tags.push("vegetarian");
  if (request.diet === "Non-vegetarian") tags.push("seafood", "non-vegetarian");
  if (request.diet === "Both") tags.push("vegetarian", "seafood");
  if (request.stayType !== "No preference") tags.push(request.stayType.toLowerCase());
  return Array.from(new Set(tags));
}

export const ragService: RagService = {
  formulateQuery(request: TripRequest): RagQuery {
    const dest =
      request.destinationPreference === "Let the planner decide"
        ? "the Mangaluru to Karwar coast"
        : request.destinationPreference;
    return {
      text:
        `${request.days}-day ${request.travelStyle.toLowerCase()} trip from ${request.startCity} ` +
        `towards ${dest} for a ${request.groupType.toLowerCase()} group of ${request.travellers}, ` +
        `interested in ${request.interests.join(", ") || "general sightseeing"}, ` +
        `${request.diet.toLowerCase()} food, ${request.budgetTier} budget of ` +
        `Rs.${request.dailyBudgetPerPerson} per person per day.`,
      filters: { tags: tagsFromRequest(request) },
      topK: 24,
    };
  },

  async embed() {
    // Embedding model not configured in Phase 1.
    return null;
  },

  async vectorSearch() {
    // Vector store not configured in Phase 1.
    return null;
  },

  async retrieve(query: RagQuery): Promise<RetrievalResult> {
    const vector = await this.vectorSearch(query);
    if (vector) {
      return {
        query,
        chunks: vector,
        strategy: "vector-search",
        embeddingsStatus: "ready",
      };
    }

    const wanted = new Set(query.filters?.tags ?? []);
    const cities = query.filters?.cities;
    const chunks: RetrievedChunk[] = KNOWLEDGE_BASE.filter(
      (entry) => !cities || cities.includes(entry.city as CoastalCity),
    )
      .map((entry) => {
        const matchedTags = entry.tags.filter((tag) => wanted.has(tag));
        const ratingBoost = (entry.rating ?? 4) / 10;
        return { entry, matchedTags, score: matchedTags.length + ratingBoost };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, query.topK ?? 24);

    return {
      query,
      chunks,
      strategy: "local-lexical",
      embeddingsStatus: "not_configured",
    };
  },
};
