import { CITY_COORDINATES, LEG_DISTANCES_KM, type CoastalCity } from "@/data/knowledgeBase";
import type { MapRoute, MapsService } from "./types";

export function legDistanceKm(from: CoastalCity, to: CoastalCity): number {
  if (from === to) return 0;
  const direct = LEG_DISTANCES_KM[`${from}-${to}`] ?? LEG_DISTANCES_KM[`${to}-${from}`];
  if (direct) return direct;
  // Sum adjacent legs along the coast when the towns are not neighbours.
  const order: CoastalCity[] = ["Mangaluru", "Udupi", "Murudeshwar", "Gokarna", "Karwar"];
  const a = order.indexOf(from);
  const b = order.indexOf(to);
  const [lo, hi] = a < b ? [a, b] : [b, a];
  let total = 0;
  for (let i = lo; i < hi; i += 1) {
    total += LEG_DISTANCES_KM[`${order[i]!}-${order[i + 1]!}`] ?? 0;
  }
  return total;
}

/**
 * Maps service. Coordinates and distance/duration estimates come from the
 * curated dataset. Real route geometry requires a Maps API and stays null
 * until one is configured.
 */
export const mapsService: MapsService = {
  getCoordinates(city: CoastalCity) {
    return CITY_COORDINATES[city];
  },

  buildRoute(cities: CoastalCity[]): MapRoute {
    let totalDistanceKm = 0;
    for (let i = 0; i < cities.length - 1; i += 1) {
      totalDistanceKm += legDistanceKm(cities[i], cities[i + 1]);
    }
    return {
      waypoints: cities.map((city) => ({ city, ...CITY_COORDINATES[city] })),
      totalDistanceKm,
      estimatedDrivingHours: Math.round((totalDistanceKm / 40) * 10) / 10,
      routeGeometry: null,
      status: "not_configured",
    };
  },

  async getRouteGeometry() {
    return null;
  },
};
