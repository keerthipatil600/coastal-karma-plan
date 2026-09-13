import type {
  TransportProviderResult,
  TransportSearchInput,
  TransportService,
} from "./types";

/**
 * Transportation services. Each provider has a real interface but no
 * connected API in Phase 1 — searches return an explicit not-configured
 * state so the UI can show a clean placeholder instead of invented
 * schedules, fares or bookings.
 */
function makeService(
  provider: "bus" | "train" | "flight",
  message: string,
): TransportService {
  return {
    provider,
    async search(_input: TransportSearchInput): Promise<TransportProviderResult> {
      void _input;
      return { provider, status: "not_configured", message, options: [] };
    },
    status() {
      return "not_configured";
    },
  };
}

export const busService = makeService(
  "bus",
  "Live bus timings and fares will appear once the bus API is configured.",
);

export const trainService = makeService(
  "train",
  "Live train availability will appear once the rail API is configured.",
);

export const flightService = makeService(
  "flight",
  "Live flight options will appear once the flight API is configured.",
);

export const transportServices = { busService, trainService, flightService };
