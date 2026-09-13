/**
 * Coastal Karnataka knowledge base.
 * Structured, source-attributed travel corpus used by the RAG + itinerary services.
 * All entries are curated static knowledge — never live pricing or availability.
 */

export type CoastalCity = "Mangaluru" | "Udupi" | "Murudeshwar" | "Gokarna" | "Karwar";

export const COASTAL_ROUTE: CoastalCity[] = [
  "Mangaluru",
  "Udupi",
  "Murudeshwar",
  "Gokarna",
  "Karwar",
];

export type KBCategory = "attraction" | "dining" | "stay" | "enroute";
export type PriceTier = "budget" | "mid" | "luxury";

export interface KnowledgeEntry {
  id: string;
  name: string;
  city: CoastalCity;
  location: string;
  category: KBCategory;
  description: string;
  tags: string[];
  priceTier: PriceTier;
  rating?: number;
  timings?: string;
  source: string;
}

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  // ---------------- Mangaluru ----------------
  {
    id: "mlr-panambur",
    name: "Panambur Beach",
    city: "Mangaluru",
    location: "Panambur, 13 km north of city centre",
    category: "attraction",
    description:
      "Broad, well-maintained beach beside the New Mangalore Port, known for its kite festival, camel rides and organised water sports.",
    tags: ["beaches", "photography", "family", "adventure"],
    priceTier: "budget",
    rating: 4.3,
    timings: "Open all day; best 4 PM - 7 PM",
    source: "Coastal Karnataka corpus - Mangaluru beaches",
  },
  {
    id: "mlr-tannirbhavi",
    name: "Tannirbhavi Beach & Tree Park",
    city: "Mangaluru",
    location: "Tannirbhavi, reachable by ferry from Sultan Battery",
    category: "attraction",
    description:
      "Quieter beach paired with a landscaped tree park; the short ferry ride across the Gurupura river is part of the experience.",
    tags: ["beaches", "nature", "photography", "couple"],
    priceTier: "budget",
    rating: 4.2,
    timings: "6 AM - 7 PM",
    source: "Coastal Karnataka corpus - Mangaluru beaches",
  },
  {
    id: "mlr-kadri",
    name: "Kadri Manjunath Temple",
    city: "Mangaluru",
    location: "Kadri Hills",
    category: "attraction",
    description:
      "10th-century temple with bronze Lokeshwara idol and nine natural spring tanks on the hill above the city.",
    tags: ["temples", "history", "culture"],
    priceTier: "budget",
    rating: 4.5,
    timings: "6 AM - 1 PM, 4 PM - 8 PM",
    source: "Coastal Karnataka corpus - Mangaluru heritage",
  },
  {
    id: "mlr-aloysius",
    name: "St. Aloysius Chapel",
    city: "Mangaluru",
    location: "Lighthouse Hill Road",
    category: "attraction",
    description:
      "Chapel covered in frescoes painted by Antonio Moscheni in 1899 — often compared to Italian chapel interiors.",
    tags: ["history", "culture", "photography"],
    priceTier: "budget",
    rating: 4.7,
    timings: "9 AM - 5:30 PM (closed during services)",
    source: "Coastal Karnataka corpus - Mangaluru heritage",
  },
  {
    id: "mlr-sultan-battery",
    name: "Sultan Battery Watchtower",
    city: "Mangaluru",
    location: "Boloor, riverfront",
    category: "attraction",
    description:
      "Laterite watchtower built by Tipu Sultan to guard the river mouth; sunset views over the backwaters.",
    tags: ["history", "photography"],
    priceTier: "budget",
    rating: 4.0,
    timings: "8 AM - 6 PM",
    source: "Coastal Karnataka corpus - Mangaluru heritage",
  },
  {
    id: "mlr-giri-manjas",
    name: "Giri Manja's",
    city: "Mangaluru",
    location: "Bunder / multiple outlets",
    category: "dining",
    description:
      "Landmark Mangalorean seafood kitchen — anjal tawa fry, ghee roast and neer dosa are the signatures.",
    tags: ["food", "seafood", "non-vegetarian"],
    priceTier: "mid",
    rating: 4.4,
    timings: "11 AM - 10 PM",
    source: "Coastal Karnataka corpus - Mangaluru dining",
  },
  {
    id: "mlr-kudla",
    name: "Kudla / Ideal Ice Cream",
    city: "Mangaluru",
    location: "Pandeshwar",
    category: "dining",
    description:
      "Vegetarian coastal thalis and the city's iconic Gadbad ice cream — a reliable pure-veg stop.",
    tags: ["food", "vegetarian", "family"],
    priceTier: "budget",
    rating: 4.3,
    timings: "10 AM - 10:30 PM",
    source: "Coastal Karnataka corpus - Mangaluru dining",
  },
  {
    id: "mlr-stay-city",
    name: "City-centre business hotels (Hampankatta belt)",
    city: "Mangaluru",
    location: "Hampankatta / Balmatta",
    category: "stay",
    description:
      "Cluster of clean mid-range hotels within walking distance of transport hubs and restaurants.",
    tags: ["stay", "hotel", "convenient"],
    priceTier: "mid",
    rating: 4.1,
    source: "Coastal Karnataka corpus - Mangaluru stays",
  },
  {
    id: "mlr-stay-beach",
    name: "Beachside resorts (Someshwar / Ullal)",
    city: "Mangaluru",
    location: "Someshwar, south Mangaluru",
    category: "stay",
    description: "Sea-facing resorts near Someshwar rock beach, suited to slower, couple-style stays.",
    tags: ["stay", "resort", "couple", "beaches"],
    priceTier: "luxury",
    rating: 4.4,
    source: "Coastal Karnataka corpus - Mangaluru stays",
  },

  // ---------------- Udupi ----------------
  {
    id: "udp-krishna",
    name: "Sri Krishna Matha",
    city: "Udupi",
    location: "Car Street, Udupi",
    category: "attraction",
    description:
      "13th-century Madhvacharya temple where the deity is viewed through the silver Kanakana Kindi window; free temple meals served daily.",
    tags: ["temples", "culture", "history", "food"],
    priceTier: "budget",
    rating: 4.7,
    timings: "5 AM - 9 PM",
    source: "Coastal Karnataka corpus - Udupi temples",
  },
  {
    id: "udp-malpe",
    name: "Malpe Beach",
    city: "Udupi",
    location: "Malpe, 6 km from Udupi",
    category: "attraction",
    description:
      "Long sandy beach with a boardwalk, water sports and the jetty for St. Mary's Island boats.",
    tags: ["beaches", "adventure", "family", "photography"],
    priceTier: "budget",
    rating: 4.4,
    timings: "Open all day",
    source: "Coastal Karnataka corpus - Udupi beaches",
  },
  {
    id: "udp-st-marys",
    name: "St. Mary's Island",
    city: "Udupi",
    location: "Boat from Malpe jetty (~30 min)",
    category: "attraction",
    description:
      "Geological monument of hexagonal basaltic columns formed by ancient lava flows; ferry runs in fair weather only.",
    tags: ["nature", "photography", "adventure"],
    priceTier: "mid",
    rating: 4.5,
    timings: "Ferries 9 AM - 4 PM, weather permitting",
    source: "Coastal Karnataka corpus - Udupi excursions",
  },
  {
    id: "udp-kaup",
    name: "Kaup Lighthouse & Beach",
    city: "Udupi",
    location: "Kaup, 12 km south of Udupi",
    category: "attraction",
    description:
      "1901 lighthouse on a rocky headland with a rewarding climb and one of the coast's best sunset viewpoints.",
    tags: ["beaches", "photography", "history"],
    priceTier: "budget",
    rating: 4.4,
    timings: "Lighthouse 4 PM - 6 PM",
    source: "Coastal Karnataka corpus - Udupi beaches",
  },
  {
    id: "udp-mitra",
    name: "Mitra Samaj Bhojanalaya",
    city: "Udupi",
    location: "Car Street, near Krishna Matha",
    category: "dining",
    description:
      "Century-old vegetarian eatery famous for goli baje, biscuit roti and filter coffee.",
    tags: ["food", "vegetarian", "budget"],
    priceTier: "budget",
    rating: 4.4,
    timings: "7 AM - 8 PM",
    source: "Coastal Karnataka corpus - Udupi dining",
  },
  {
    id: "udp-seafood",
    name: "Malpe seafood shacks",
    city: "Udupi",
    location: "Malpe beach road",
    category: "dining",
    description: "Day-catch fish thalis and squid fry served simply, a short walk from the sand.",
    tags: ["food", "seafood", "non-vegetarian"],
    priceTier: "budget",
    rating: 4.2,
    timings: "11 AM - 10 PM",
    source: "Coastal Karnataka corpus - Udupi dining",
  },
  {
    id: "udp-stay",
    name: "Malpe beach hotels & homestays",
    city: "Udupi",
    location: "Malpe / Udupi town",
    category: "stay",
    description:
      "Range from simple homestays near Car Street to beachfront hotels at Malpe with easy jetty access.",
    tags: ["stay", "homestay", "family"],
    priceTier: "mid",
    rating: 4.2,
    source: "Coastal Karnataka corpus - Udupi stays",
  },

  // ---------------- Murudeshwar ----------------
  {
    id: "mud-statue",
    name: "Murudeshwar Shiva Statue & Temple",
    city: "Murudeshwar",
    location: "Kanduka Hill, Murudeshwar",
    category: "attraction",
    description:
      "123-ft Shiva statue on a headland with the Arabian Sea on three sides, beside the Murudeshwar temple complex.",
    tags: ["temples", "photography", "culture", "history"],
    priceTier: "budget",
    rating: 4.6,
    timings: "6 AM - 8 PM",
    source: "Coastal Karnataka corpus - Murudeshwar",
  },
  {
    id: "mud-gopura",
    name: "Raja Gopura Lift View",
    city: "Murudeshwar",
    location: "Temple complex, Murudeshwar",
    category: "attraction",
    description:
      "20-storey gateway tower with a lift to a viewing gallery looking down on the statue and coastline.",
    tags: ["photography", "family"],
    priceTier: "budget",
    rating: 4.3,
    timings: "7:30 AM - 6:30 PM",
    source: "Coastal Karnataka corpus - Murudeshwar",
  },
  {
    id: "mud-netrani",
    name: "Netrani Island snorkelling & diving",
    city: "Murudeshwar",
    location: "Boat from Murudeshwar jetty (~2 hrs)",
    category: "attraction",
    description:
      "Heart-shaped island with the clearest water on the Karnataka coast; operators run guided dives October to May.",
    tags: ["adventure", "nature", "photography"],
    priceTier: "luxury",
    rating: 4.5,
    timings: "Departures early morning, season dependent",
    source: "Coastal Karnataka corpus - Murudeshwar excursions",
  },
  {
    id: "mud-beach",
    name: "Murudeshwar Beach",
    city: "Murudeshwar",
    location: "Below the temple hill",
    category: "attraction",
    description: "Calm crescent beach with jet-ski and boat rides, framed by the statue on the hill.",
    tags: ["beaches", "adventure", "family"],
    priceTier: "budget",
    rating: 4.2,
    timings: "Open all day",
    source: "Coastal Karnataka corpus - Murudeshwar",
  },
  {
    id: "mud-dining",
    name: "Temple-road veg canteens & fish grills",
    city: "Murudeshwar",
    location: "Temple approach road",
    category: "dining",
    description:
      "Simple canteens serving pure-veg meals for pilgrims, plus a few grills doing fresh pomfret and prawns.",
    tags: ["food", "vegetarian", "seafood"],
    priceTier: "budget",
    rating: 4.0,
    timings: "7 AM - 9:30 PM",
    source: "Coastal Karnataka corpus - Murudeshwar dining",
  },
  {
    id: "mud-stay",
    name: "Sea-view hotels near the temple",
    city: "Murudeshwar",
    location: "Murudeshwar town",
    category: "stay",
    description:
      "Limited but comfortable inventory; upper-floor sea-view rooms are worth requesting in advance.",
    tags: ["stay", "hotel", "beaches"],
    priceTier: "mid",
    rating: 4.1,
    source: "Coastal Karnataka corpus - Murudeshwar stays",
  },

  // ---------------- Gokarna ----------------
  {
    id: "gok-mahabaleshwar",
    name: "Mahabaleshwara Temple",
    city: "Gokarna",
    location: "Car Street, Gokarna",
    category: "attraction",
    description:
      "Ancient temple housing the Atmalinga, the reason Gokarna is one of the coast's major pilgrimage towns.",
    tags: ["temples", "culture", "history"],
    priceTier: "budget",
    rating: 4.6,
    timings: "6 AM - 12:30 PM, 5 PM - 8 PM",
    source: "Coastal Karnataka corpus - Gokarna temples",
  },
  {
    id: "gok-om",
    name: "Om Beach",
    city: "Gokarna",
    location: "6 km south of Gokarna town",
    category: "attraction",
    description:
      "Om-shaped twin cove, the most popular of Gokarna's beaches, with shacks, kayaks and banana-boat rides.",
    tags: ["beaches", "nightlife", "adventure", "photography"],
    priceTier: "budget",
    rating: 4.5,
    timings: "Open all day",
    source: "Coastal Karnataka corpus - Gokarna beaches",
  },
  {
    id: "gok-trek",
    name: "Kudle - Om - Half Moon - Paradise beach trek",
    city: "Gokarna",
    location: "Cliff trail south of Gokarna town",
    category: "attraction",
    description:
      "Classic 4-beach cliff trek of roughly 3-4 hours; start early and carry water as shade is limited.",
    tags: ["adventure", "nature", "backpacker", "photography"],
    priceTier: "budget",
    rating: 4.7,
    timings: "Best 6:30 AM - 10 AM",
    source: "Coastal Karnataka corpus - Gokarna treks",
  },
  {
    id: "gok-mirjan",
    name: "Mirjan Fort",
    city: "Gokarna",
    location: "Mirjan, 22 km from Gokarna",
    category: "attraction",
    description:
      "Laterite fort with moats and bastions on the Aghanashini river, associated with queen Chennabhairadevi.",
    tags: ["history", "photography", "culture"],
    priceTier: "budget",
    rating: 4.3,
    timings: "8 AM - 5:30 PM",
    source: "Coastal Karnataka corpus - Gokarna heritage",
  },
  {
    id: "gok-dining",
    name: "Kudle & Om Beach cafes",
    city: "Gokarna",
    location: "Kudle and Om beaches",
    category: "dining",
    description:
      "Backpacker cafes doing thalis, Israeli and Italian plates and fresh catch of the day at sunset.",
    tags: ["food", "vegetarian", "seafood", "backpacker"],
    priceTier: "budget",
    rating: 4.3,
    timings: "8 AM - 11 PM",
    source: "Coastal Karnataka corpus - Gokarna dining",
  },
  {
    id: "gok-stay",
    name: "Beach huts, hostels & cliff resorts",
    city: "Gokarna",
    location: "Kudle / Om Beach cliffs",
    category: "stay",
    description:
      "From bamboo huts and hostels on the sand to boutique cliff-top resorts with sea-facing pools.",
    tags: ["stay", "backpacker", "couple", "beaches"],
    priceTier: "budget",
    rating: 4.2,
    source: "Coastal Karnataka corpus - Gokarna stays",
  },

  // ---------------- Karwar ----------------
  {
    id: "kwr-rabindranath",
    name: "Rabindranath Tagore Beach",
    city: "Karwar",
    location: "Karwar town waterfront",
    category: "attraction",
    description:
      "Landscaped town beach with a promenade, aquarium and the decommissioned INS Chapal warship museum alongside.",
    tags: ["beaches", "family", "history", "photography"],
    priceTier: "budget",
    rating: 4.3,
    timings: "Beach all day; museum 10 AM - 6 PM",
    source: "Coastal Karnataka corpus - Karwar",
  },
  {
    id: "kwr-devbagh",
    name: "Devbagh Beach & island water sports",
    city: "Karwar",
    location: "Devbagh, across the Kali estuary",
    category: "attraction",
    description:
      "Casuarina-lined island beach reached by boat, the base for parasailing, snorkelling and dolphin-spotting trips.",
    tags: ["beaches", "adventure", "nature", "couple"],
    priceTier: "mid",
    rating: 4.4,
    timings: "Boats 9 AM - 5 PM",
    source: "Coastal Karnataka corpus - Karwar excursions",
  },
  {
    id: "kwr-sadashivgad",
    name: "Sadashivgad Hill Fort & Durga Temple",
    city: "Karwar",
    location: "Kali river mouth, north Karwar",
    category: "attraction",
    description:
      "Hilltop fort ruins and temple with a panorama over the Kali river bridge, harbour and Arabian Sea.",
    tags: ["history", "temples", "photography"],
    priceTier: "budget",
    rating: 4.2,
    timings: "7 AM - 7 PM",
    source: "Coastal Karnataka corpus - Karwar heritage",
  },
  {
    id: "kwr-kurumgad",
    name: "Kurumgad Island boat trip",
    city: "Karwar",
    location: "Boat from Karwar jetty",
    category: "attraction",
    description:
      "Tortoise-shaped island with a Narasimha temple, quiet coves and good snorkelling in clear season.",
    tags: ["nature", "adventure", "photography"],
    priceTier: "mid",
    rating: 4.2,
    timings: "Boats subject to sea conditions",
    source: "Coastal Karnataka corpus - Karwar excursions",
  },
  {
    id: "kwr-dining",
    name: "Karwar fish curry & rice houses",
    city: "Karwar",
    location: "Karwar town / Kodibag",
    category: "dining",
    description:
      "Konkani-Karwari kitchens known for kane fry, prawn ghassi and rice-flour bhakri; veg thalis available.",
    tags: ["food", "seafood", "non-vegetarian", "vegetarian"],
    priceTier: "mid",
    rating: 4.4,
    timings: "11:30 AM - 10 PM",
    source: "Coastal Karnataka corpus - Karwar dining",
  },
  {
    id: "kwr-stay",
    name: "Karwar town hotels & Devbagh eco-cottages",
    city: "Karwar",
    location: "Karwar / Devbagh",
    category: "stay",
    description:
      "Practical town hotels near the bus stand, plus tented eco-cottages on Devbagh island for a splurge night.",
    tags: ["stay", "resort", "couple"],
    priceTier: "luxury",
    rating: 4.3,
    source: "Coastal Karnataka corpus - Karwar stays",
  },

  // ---------------- En-route notes ----------------
  {
    id: "route-mlr-udp",
    name: "Mangaluru to Udupi (NH-66, ~58 km)",
    city: "Udupi",
    location: "NH-66 via Mulki and Kaup",
    category: "enroute",
    description:
      "Roughly 1.5 hrs by road. Worthwhile stops: Mulki river bridge, Kaup lighthouse at sunset, Padubidri blue-flag beach.",
    tags: ["enroute", "road", "beaches"],
    priceTier: "budget",
    source: "Coastal Karnataka corpus - en-route notes",
  },
  {
    id: "route-udp-mud",
    name: "Udupi to Murudeshwar (NH-66, ~100 km)",
    city: "Murudeshwar",
    location: "NH-66 via Kundapura and Bhatkal",
    category: "enroute",
    description:
      "About 2.5 hrs. Detour options: Maravanthe where road runs between river and sea, Kollur Mookambika temple, Bhatkal's Jamia mosque.",
    tags: ["enroute", "road", "temples", "photography"],
    priceTier: "budget",
    source: "Coastal Karnataka corpus - en-route notes",
  },
  {
    id: "route-mud-gok",
    name: "Murudeshwar to Gokarna (~70 km)",
    city: "Gokarna",
    location: "NH-66 via Honnavar and Kumta",
    category: "enroute",
    description:
      "Around 1.5-2 hrs. Stops: Honnavar Sharavathi backwaters, Apsarakonda falls, Mirjan Fort just before Gokarna.",
    tags: ["enroute", "road", "nature", "history"],
    priceTier: "budget",
    source: "Coastal Karnataka corpus - en-route notes",
  },
  {
    id: "route-gok-kwr",
    name: "Gokarna to Karwar (~60 km)",
    city: "Karwar",
    location: "NH-66 via Ankola",
    category: "enroute",
    description:
      "About 1.5 hrs of some of the coast's best driving. Stops: Belekeri and Ankola beaches, Kali river bridge viewpoint.",
    tags: ["enroute", "road", "beaches", "photography"],
    priceTier: "budget",
    source: "Coastal Karnataka corpus - en-route notes",
  },
];

export const CITY_COORDINATES: Record<CoastalCity, { lat: number; lng: number }> = {
  Mangaluru: { lat: 12.9141, lng: 74.856 },
  Udupi: { lat: 13.3409, lng: 74.7421 },
  Murudeshwar: { lat: 14.0942, lng: 74.4844 },
  Gokarna: { lat: 14.5479, lng: 74.3188 },
  Karwar: { lat: 14.8137, lng: 74.1298 },
};

/** Approximate road distances between adjacent coastal towns (km). */
export const LEG_DISTANCES_KM: Record<string, number> = {
  "Mangaluru-Udupi": 58,
  "Udupi-Murudeshwar": 100,
  "Murudeshwar-Gokarna": 70,
  "Gokarna-Karwar": 60,
};

export function entriesForCity(city: CoastalCity, category?: KBCategory) {
  return KNOWLEDGE_BASE.filter(
    (entry) => entry.city === city && (!category || entry.category === category),
  );
}
