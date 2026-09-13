import { useState } from "react";
import { COASTAL_ROUTE, type CoastalCity } from "@/data/knowledgeBase";
import type {
  BudgetTier,
  DietPreference,
  GroupType,
  Interest,
  StayType,
  TransportMode,
  TravelStyle,
  TripRequest,
} from "@/services/types";

const INTERESTS: Interest[] = [
  "Beaches",
  "Temples",
  "Food",
  "Adventure",
  "Nature",
  "History",
  "Culture",
  "Photography",
  "Shopping",
  "Nightlife",
];

const STYLES: TravelStyle[] = [
  "Relaxed",
  "Balanced",
  "Adventure",
  "Cultural",
  "Family",
  "Couple",
  "Backpacker",
];

const TIERS: { value: BudgetTier; label: string }[] = [
  { value: "budget", label: "Budget" },
  { value: "mid-range", label: "Mid-range" },
  { value: "luxury", label: "Luxury" },
];

const label = "block text-sm font-medium text-primary";
const field =
  "mt-1.5 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-secondary focus:ring-2 focus:ring-ring/30";
const sectionTitle = "font-display text-lg font-semibold text-primary";

export function TripForm({
  onSubmit,
  submitting,
}: {
  onSubmit: (request: TripRequest) => void;
  submitting: boolean;
}) {
  const [days, setDays] = useState(4);
  const [startCity, setStartCity] = useState<CoastalCity>("Mangaluru");
  const [destination, setDestination] = useState<TripRequest["destinationPreference"]>(
    "Let the planner decide",
  );
  const [travelDate, setTravelDate] = useState("");
  const [dailyBudget, setDailyBudget] = useState(2500);
  const [budgetTier, setBudgetTier] = useState<BudgetTier>("mid-range");
  const [travelStyle, setTravelStyle] = useState<TravelStyle>("Balanced");
  const [interests, setInterests] = useState<Interest[]>(["Beaches", "Food"]);
  const [diet, setDiet] = useState<DietPreference>("Both");
  const [transport, setTransport] = useState<TransportMode>("Any");
  const [groupType, setGroupType] = useState<GroupType>("Friends");
  const [travellers, setTravellers] = useState(2);
  const [maxTravelHours, setMaxTravelHours] = useState(4);
  const [stayType, setStayType] = useState<StayType>("No preference");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleInterest = (interest: Interest) =>
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest],
    );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (days < 1 || days > 14) next["days"] = "Choose between 1 and 14 days.";
    if (!travelDate) next["travelDate"] = "Pick a travel date.";
    if (dailyBudget < 500) next["dailyBudget"] = "Enter at least ₹500 per person per day.";
    if (travellers < 1 || travellers > 20) next["travellers"] = "Enter 1 to 20 travellers.";
    if (interests.length === 0) next["interests"] = "Select at least one interest.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onSubmit({
      days,
      startCity,
      destinationPreference: destination,
      travelDate,
      dailyBudgetPerPerson: dailyBudget,
      budgetTier,
      travelStyle,
      interests,
      diet,
      transport,
      groupType,
      travellers,
      maxTravelHoursPerDay: maxTravelHours,
      stayType,
    });
  };

  const err = (key: string) =>
    errors[key] ? <p className="mt-1 text-xs text-destructive">{errors[key]}</p> : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className={sectionTitle}>Trip details</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="days">
              Number of days ({days})
            </label>
            <input
              id="days"
              type="range"
              min={1}
              max={14}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="mt-3 w-full accent-secondary"
            />
            {err("days")}
          </div>
          <div>
            <label className={label} htmlFor="travelDate">
              Travel date
            </label>
            <input
              id="travelDate"
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className={field}
            />
            {err("travelDate")}
          </div>
          <div>
            <label className={label} htmlFor="startCity">
              Starting city
            </label>
            <select
              id="startCity"
              value={startCity}
              onChange={(e) => setStartCity(e.target.value as CoastalCity)}
              className={field}
            >
              {COASTAL_ROUTE.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="destination">
              Destination preference
            </label>
            <select
              id="destination"
              value={destination}
              onChange={(e) =>
                setDestination(e.target.value as TripRequest["destinationPreference"])
              }
              className={field}
            >
              <option value="Let the planner decide">Let the planner decide</option>
              {COASTAL_ROUTE.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className={sectionTitle}>Budget</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="dailyBudget">
              Daily budget per person (₹)
            </label>
            <input
              id="dailyBudget"
              type="number"
              min={500}
              step={100}
              value={dailyBudget}
              onChange={(e) => setDailyBudget(Number(e.target.value))}
              className={field}
            />
            {err("dailyBudget")}
          </div>
          <div>
            <span className={label}>Budget tier</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {TIERS.map((tier) => (
                <button
                  key={tier.value}
                  type="button"
                  onClick={() => setBudgetTier(tier.value)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    budgetTier === tier.value
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-background text-primary hover:border-secondary"
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className={sectionTitle}>Travel style &amp; interests</h2>
        <div className="mt-4">
          <span className={label}>Travel style</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {STYLES.map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => setTravelStyle(style)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  travelStyle === style
                    ? "bg-secondary text-secondary-foreground"
                    : "border border-border bg-background text-primary hover:border-secondary"
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <span className={label}>Interests (select all that apply)</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {INTERESTS.map((interest) => {
              const active = interests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleInterest(interest)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    active
                      ? "bg-accent text-accent-foreground"
                      : "border border-border bg-background text-primary hover:border-accent"
                  }`}
                >
                  {interest}
                </button>
              );
            })}
          </div>
          {err("interests")}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className={sectionTitle}>Food &amp; travel logistics</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="diet">
              Food &amp; diet
            </label>
            <select
              id="diet"
              value={diet}
              onChange={(e) => setDiet(e.target.value as DietPreference)}
              className={field}
            >
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-vegetarian">Non-vegetarian (coastal seafood)</option>
              <option value="Both">Both</option>
            </select>
          </div>
          <div>
            <label className={label} htmlFor="transport">
              Transportation preference
            </label>
            <select
              id="transport"
              value={transport}
              onChange={(e) => setTransport(e.target.value as TransportMode)}
              className={field}
            >
              {["Bus", "Train", "Flight", "Any"].map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className={sectionTitle}>Optional preferences</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="groupType">
              Group type
            </label>
            <select
              id="groupType"
              value={groupType}
              onChange={(e) => setGroupType(e.target.value as GroupType)}
              className={field}
            >
              {["Solo", "Couple", "Family", "Friends"].map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="travellers">
              Number of travellers
            </label>
            <input
              id="travellers"
              type="number"
              min={1}
              max={20}
              value={travellers}
              onChange={(e) => setTravellers(Number(e.target.value))}
              className={field}
            />
            {err("travellers")}
          </div>
          <div>
            <label className={label} htmlFor="maxTravelHours">
              Max travel time per day ({maxTravelHours} hrs)
            </label>
            <input
              id="maxTravelHours"
              type="range"
              min={1}
              max={10}
              value={maxTravelHours}
              onChange={(e) => setMaxTravelHours(Number(e.target.value))}
              className="mt-3 w-full accent-secondary"
            />
          </div>
          <div>
            <label className={label} htmlFor="stayType">
              Preferred stay type
            </label>
            <select
              id="stayType"
              value={stayType}
              onChange={(e) => setStayType(e.target.value as StayType)}
              className={field}
            >
              {["No preference", "Hostel", "Homestay", "Hotel", "Beach resort"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-accent px-8 py-4 font-display text-lg font-semibold text-accent-foreground shadow-lg transition hover:brightness-95 disabled:opacity-60 sm:w-auto"
      >
        {submitting ? "Building your itinerary…" : "Generate my itinerary"}
      </button>
    </form>
  );
}
