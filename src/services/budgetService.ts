import type { BudgetBreakdown, TransportLeg, TripRequest } from "./types";

const SHARE_BY_TIER: Record<
  TripRequest["budgetTier"],
  { accommodation: number; food: number; localTransport: number; activities: number; misc: number }
> = {
  budget: { accommodation: 0.3, food: 0.28, localTransport: 0.14, activities: 0.18, misc: 0.1 },
  "mid-range": {
    accommodation: 0.36,
    food: 0.26,
    localTransport: 0.12,
    activities: 0.18,
    misc: 0.08,
  },
  luxury: { accommodation: 0.44, food: 0.24, localTransport: 0.1, activities: 0.15, misc: 0.07 },
};

const INTERCITY_RATE_PER_KM: Record<TripRequest["budgetTier"], number> = {
  budget: 2.2,
  "mid-range": 3.5,
  luxury: 6,
};

/**
 * Budget service. Produces an estimate from the traveller's own daily budget
 * and the planned route. Live-priced items (real transport or stay quotes)
 * are kept in a separate bucket so estimates and API prices are never
 * double-counted.
 */
export function buildBudget(request: TripRequest, legs: TransportLeg[]): BudgetBreakdown {
  const { days, travellers, dailyBudgetPerPerson, budgetTier } = request;
  const pool = dailyBudgetPerPerson * days * travellers;
  const shares = SHARE_BY_TIER[budgetTier];
  const round = (n: number) => Math.round(n / 10) * 10;

  const intercityKm = legs.reduce((sum, leg) => sum + leg.distanceKm, 0);
  const intercityTransport = round(intercityKm * INTERCITY_RATE_PER_KM[budgetTier] * travellers);

  const estimated = {
    accommodation: round(pool * shares.accommodation),
    food: round(pool * shares.food),
    localTransport: round(pool * shares.localTransport),
    intercityTransport,
    activities: round(pool * shares.activities),
    misc: round(pool * shares.misc),
  };

  const estimatedTotal = Object.values(estimated).reduce((a, b) => a + b, 0);

  return {
    currency: "INR",
    perPersonPerDay: dailyBudgetPerPerson,
    travellers,
    days,
    estimated,
    estimatedTotal,
    livePriced: [],
    notes: [
      "All figures are planning estimates derived from your daily budget and route distance.",
      "Inter-city transport is estimated by distance; it will be replaced by live fares once a transport API is connected — not added on top.",
      "No bookings are made and no live prices are shown anywhere in this itinerary.",
    ],
  };
}
