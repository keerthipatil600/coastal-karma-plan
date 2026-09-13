import type { LlmPrompt, LlmService, RetrievalResult, TripRequest } from "./types";

/**
 * LLM service. Prompt engineering lives here so a model can be plugged in
 * without touching the itinerary logic. No model is connected in Phase 1, so
 * generation returns null and the itinerary service uses its deterministic
 * personalisation instead of inventing model output.
 */
export const llmService: LlmService = {
  buildPrompt(request: TripRequest, retrieval: RetrievalResult): LlmPrompt {
    const context = retrieval.chunks
      .slice(0, 16)
      .map(
        (chunk) =>
          `- ${chunk.entry.name} (${chunk.entry.city}, ${chunk.entry.category}): ${chunk.entry.description} [tags: ${chunk.entry.tags.join(", ")}] [source: ${chunk.entry.source}]`,
      )
      .join("\n");

    return {
      system:
        "You are a Coastal Karnataka travel planner. Use only the supplied knowledge context. " +
        "Never invent prices, timings, or bookings. Return a structured day-by-day itinerary " +
        "with morning, afternoon and evening blocks, food picks, an overnight stay and a short " +
        "reason for every recommendation.",
      user: `Traveller brief:\n${retrieval.query.text}\nMax travel time per day: ${request.maxTravelHoursPerDay} hrs.\nPreferred stay: ${request.stayType}.\nTransport preference: ${request.transport}.\n\nKnowledge context:\n${context}`,
    };
  },

  async generateItineraryNarrative() {
    return null;
  },

  status() {
    return "not_configured";
  },
};
