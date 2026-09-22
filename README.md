# Coastal Karnataka Explorer

Build Phase 1 of the Coastal Karnataka Smart Travel Planner web application based on the user's specification.

Key requirements:
1. Visual identity: Professional coastal travel aesthetic using deep ocean/teal (#0b3d3a, #0e6b63), sand/beige (#f5efe0), clean white cards, and subtle coral/gold accents. Fully responsive and mobile-friendly.

2. Homepage & Hero:
- Headline: "Coastal Karnataka Smart Travel Planner"
- Subtitle: "Plan smarter. Explore more. Travel your way."
- Call-to-action: "Plan My Trip"
- Explanatory section explaining AI-assisted personalized itineraries and the regional scope (Mangaluru to Karwar).

3. Comprehensive Trip Planning Form:
- Trip Details: Number of days (1-14), starting city (Mangaluru, Udupi, Murudeshwar, Gokarna, Karwar), destination preference, travel date.
- Budget: Daily budget per person (INR) and tier (Budget, Mid-range, Luxury).
- Travel Style: Relaxed, Balanced, Adventure, Cultural, Family, Couple, Backpacker.
- Interests (multi-select): Beaches, Temples, Food, Adventure, Nature, History, Culture, Photography, Shopping, Nightlife.
- Food & Diet: Vegetarian, Non-vegetarian (coastal seafood), Both.
- Transportation Preferences: Bus, Train, Flight, Any.
- Optional parameters: Group type (Solo/Couple/Family/Friends), max travel time per day, preferred stay type.
- Form validation and smooth submission.

4. Modular Architecture & Services:
- Separate services with clean TypeScript interfaces:
  - Itinerary Service
  - RAG Service (interface for query formulation, embeddings, vector search, semantic retrieval)
  - LLM Service (interface for prompt engineering and structured generation)
  - Maps Service (interface for coordinates, route geometry, distance/duration)
  - Transportation Services: Bus Service, Train Service, Flight Service
  - Budget Service (breakdown: accommodation, food, local transport, intercity transport, activities, misc)
- IMPORTANT: No fake live data or simulated bookings. Clearly show clean placeholder/unconnected states for external APIs (e.g. "Live transportation data will appear once the transportation API is configured").

5. Knowledge Base:
- Migrate all Coastal Karnataka data from the provided corpus into a structured data module (attractions, dining, stays, en-route notes for Mangaluru, Udupi, Murudeshwar, Gokarna, Karwar) with rich metadata: name, location/city, category, description, tags, price tier, rating, timings, source.

6. Itinerary Results View:
- Trip summary stats and route progression bar (e.g., Mangaluru → Udupi → Murudeshwar → Gokarna).
- Day-by-day morning, afternoon, evening breakdown with places, descriptions, durations, food picks, and overnight stay cards.
- "Why this recommendation?" explanation tags on recommended spots.
- "How Your Trip Was Generated" pipeline diagram showing: User Preferences → Semantic Search → Relevant Travel Info → LLM Personalization → Route Calculation → Transport Info → Final Itinerary.
- Budget Breakdown card distinguishing estimated costs vs live API prices, avoiding double-counting.
- Transportation cards for inter-city legs with clean empty states ready for future API integration.
- Map view container ready for Google Maps integration.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://coastal-karma-plan.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/379faa9c-0861-4606-840e-350141e6cf67).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
