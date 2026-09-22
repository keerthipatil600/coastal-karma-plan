/**
 * Browser-side query embeddings.
 *
 * Produces normalized 384-dimensional vectors with Xenova/all-MiniLM-L6-v2 —
 * the same model that produced the stored `knowledge_chunks.embedding`
 * vector(384) values, so query and document vectors live in the same space.
 *
 * The model is loaded lazily on the first embedding request and cached for the
 * rest of the session. Nothing here touches the database schema, the stored
 * records, or any paid API.
 */

export const EMBEDDING_MODEL_ID = "Xenova/all-MiniLM-L6-v2";
export const EMBEDDING_DIMENSIONS = 384;

export class EmbeddingModelError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "EmbeddingModelError";
  }
}

type FeatureExtractor = (
  text: string,
  options: { pooling: "mean"; normalize: boolean },
) => Promise<{ data: ArrayLike<number> }>;

let extractorPromise: Promise<FeatureExtractor> | null = null;

/** True once the model is cached in memory for this session. */
export function isEmbeddingModelLoaded(): boolean {
  return extractorPromise !== null;
}

async function loadExtractor(): Promise<FeatureExtractor> {
  if (typeof window === "undefined") {
    throw new EmbeddingModelError(
      "Query embeddings run in the browser only; this call happened during server rendering.",
    );
  }

  // Dynamic import keeps the ~large transformers runtime out of the initial bundle.
  const { pipeline, env } = await import("@huggingface/transformers");
  // Always fetch weights from the Hugging Face CDN — no local model files are bundled.
  env.allowLocalModels = false;

  const extractor = await pipeline("feature-extraction", EMBEDDING_MODEL_ID);
  return extractor as unknown as FeatureExtractor;
}

/**
 * Load (once) and return the feature-extraction pipeline.
 * A failed load is not cached, so a later retry can succeed.
 */
export async function getEmbeddingModel(): Promise<FeatureExtractor> {
  if (!extractorPromise) {
    extractorPromise = loadExtractor().catch((error) => {
      extractorPromise = null;
      throw new EmbeddingModelError(
        "The on-device search model could not be loaded. Check your connection and try again.",
        { cause: error },
      );
    });
  }
  return extractorPromise;
}

/**
 * Embed a single travel query into a normalized 384-dimensional vector.
 * Returns plain numbers, ready to send to Postgres as a `vector(384)` literal.
 */
export async function embedQuery(text: string): Promise<number[]> {
  const input = text.trim();
  if (!input) {
    throw new EmbeddingModelError("Cannot embed an empty query.");
  }

  const extractor = await getEmbeddingModel();

  let output: { data: ArrayLike<number> };
  try {
    output = await extractor(input, { pooling: "mean", normalize: true });
  } catch (error) {
    throw new EmbeddingModelError("Generating the search vector failed.", { cause: error });
  }

  const vector = Array.from(output.data, Number);
  if (vector.length !== EMBEDDING_DIMENSIONS) {
    throw new EmbeddingModelError(
      `Expected a ${EMBEDDING_DIMENSIONS}-dimensional embedding but received ${vector.length}.`,
    );
  }
  if (vector.some((value) => !Number.isFinite(value))) {
    throw new EmbeddingModelError("The generated embedding contained invalid values.");
  }

  return vector;
}
