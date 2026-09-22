import { embedQuery, EmbeddingModelError, EMBEDDING_DIMENSIONS } from "./queryEmbedding";
import { getSupabaseClient, isSupabaseConfigured } from "./supabaseBrowserClient";

/**
 * Semantic search over the existing `knowledge_chunks` records.
 *
 * Flow: user travel query -> browser embedding (384-d, normalized)
 *       -> existing match_knowledge_chunks() RPC -> ranked chunks.
 *
 * The database schema, the stored 38 records and the RPC itself are untouched.
 */

export interface KnowledgeChunkMatch {
  chunk_id: string;
  place_id: string | null;
  place_name: string | null;
  source_document_id: string | null;
  source_title: string | null;
  source_url: string | null;
  content: string;
  similarity: number;
}

export type KnowledgeChunkSearchStatus =
  | "ok"
  | "not_configured"
  | "model_error"
  | "search_error";

export interface KnowledgeChunkSearchResult {
  status: KnowledgeChunkSearchStatus;
  matches: KnowledgeChunkMatch[];
  /** Present when status is not "ok" — safe to show in the UI. */
  message?: string;
  /** Dimensions of the query vector actually sent (0 when none was sent). */
  queryDimensions: number;
}

export interface KnowledgeChunkSearchOptions {
  /** Max rows to return from the RPC. */
  matchCount?: number;
  /** Minimum cosine similarity, as accepted by the existing RPC. */
  matchThreshold?: number;
}

export async function searchKnowledgeChunks(
  query: string,
  options: KnowledgeChunkSearchOptions = {},
): Promise<KnowledgeChunkSearchResult> {
  const { matchCount = 8, matchThreshold = 0.2 } = options;

  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      status: "not_configured",
      matches: [],
      queryDimensions: 0,
      message: isSupabaseConfigured()
        ? "The knowledge base client could not be created."
        : "Semantic search will appear once the knowledge base connection is configured.",
    };
  }

  // 1. Lazily load the model and build the 384-dimensional query vector.
  let queryEmbedding: number[];
  try {
    queryEmbedding = await embedQuery(query);
  } catch (error) {
    return {
      status: "model_error",
      matches: [],
      queryDimensions: 0,
      message:
        error instanceof EmbeddingModelError
          ? error.message
          : "The on-device search model is unavailable right now.",
    };
  }

  // 2. Hand that vector to the existing match_knowledge_chunks() RPC.
  const { data, error } = await supabase.rpc("match_knowledge_chunks", {
    query_embedding: queryEmbedding,
    match_count: matchCount,
    match_threshold: matchThreshold,
  });

  if (error) {
    return {
      status: "search_error",
      matches: [],
      queryDimensions: queryEmbedding.length,
      message: `Semantic search failed: ${error.message}`,
    };
  }

  return {
    status: "ok",
    matches: (data ?? []) as KnowledgeChunkMatch[],
    queryDimensions: queryEmbedding.length || EMBEDDING_DIMENSIONS,
  };
}
