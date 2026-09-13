import type { Itinerary, PlannedActivity } from "@/services/types";

const card = "rounded-2xl border border-border bg-card p-6 shadow-sm";
const heading = "font-display text-xl font-semibold text-primary";

function money(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function Block({ title, activities }: { title: string; activities: PlannedActivity[] }) {
  if (activities.length === 0) return null;
  return (
    <div className="border-t border-border pt-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-secondary">{title}</p>
      <div className="mt-3 space-y-4">
        {activities.map((activity) => (
          <div key={`${title}-${activity.name}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h4 className="font-medium text-foreground">{activity.name}</h4>
              <span className="text-xs text-muted-foreground">≈ {activity.durationHours} hrs</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{activity.description}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {activity.reasons.map((reason) => (
                <span
                  key={reason}
                  title="Why this recommendation?"
                  className="rounded-full bg-sand px-2.5 py-1 text-[11px] text-primary"
                >
                  Why? {reason}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ItineraryResults({ itinerary }: { itinerary: Itinerary }) {
  const { request, route, days, transportLegs, budget, generation, map } = itinerary;

  return (
    <div className="space-y-8">
      <section className={card}>
        <h2 className={heading}>Trip summary</h2>
        <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Days", value: String(request.days) },
            { label: "Towns", value: String(route.length) },
            { label: "Route distance", value: `${map.totalDistanceKm} km` },
            { label: "Estimated total", value: money(budget.estimatedTotal) },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl bg-sand p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                {stat.label}
              </dt>
              <dd className="mt-1 font-display text-xl text-primary">{stat.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
            Route progression
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {route.map((city, index) => (
              <span key={city} className="flex items-center gap-2">
                <span className="rounded-full bg-primary px-3.5 py-1.5 text-sm text-primary-foreground">
                  {city}
                </span>
                {index < route.length - 1 && <span className="text-secondary">→</span>}
              </span>
            ))}
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full w-full bg-gradient-to-r from-primary via-secondary to-gold" />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        {days.map((day) => (
          <article key={day.day} className={card}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className={heading}>
                Day {day.day} · {day.city}
              </h3>
              <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                {request.travelStyle} pace
              </span>
            </div>
            {day.travelNote && (
              <p className="mt-3 rounded-xl bg-sand p-3 text-sm text-primary">{day.travelNote}</p>
            )}
            <div className="mt-5 space-y-5">
              <Block title="Morning" activities={day.morning} />
              <Block title="Afternoon" activities={day.afternoon} />
              <Block title="Evening" activities={day.evening} />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  Food picks
                </p>
                {day.foodPicks.length ? (
                  <ul className="mt-2 space-y-2">
                    {day.foodPicks.map((food) => (
                      <li key={food.id}>
                        <p className="text-sm font-medium text-foreground">{food.name}</p>
                        <p className="text-xs text-muted-foreground">{food.description}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-xs text-muted-foreground">
                    No matching dining entry in the knowledge base for this town yet.
                  </p>
                )}
              </div>
              <div className="rounded-xl border border-border p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  Overnight stay
                </p>
                {day.stay ? (
                  <>
                    <p className="mt-2 text-sm font-medium text-foreground">{day.stay.name}</p>
                    <p className="text-xs text-muted-foreground">{day.stay.description}</p>
                    <p className="mt-2 text-[11px] text-muted-foreground">
                      Live room rates and availability will appear once a stay API is configured.
                    </p>
                  </>
                ) : (
                  <p className="mt-2 text-xs text-muted-foreground">Stay suggestion unavailable.</p>
                )}
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className={card}>
        <h2 className={heading}>How your trip was generated</h2>
        <ol className="mt-4 grid gap-3 md:grid-cols-7">
          {generation.steps.map((step, index) => (
            <li key={step.id} className="rounded-xl bg-sand p-3">
              <p className="text-[11px] text-muted-foreground">Step {index + 1}</p>
              <p className="mt-1 text-sm font-semibold text-primary">{step.label}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{step.detail}</p>
              <span
                className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] ${
                  step.status === "done"
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step.status === "done" ? "active" : "awaiting API"}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className={card}>
        <h2 className={heading}>Budget breakdown</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Estimated from {money(budget.perPersonPerDay)} per person per day × {budget.days} days ×{" "}
          {budget.travellers} traveller(s).
        </p>
        <ul className="mt-4 divide-y divide-border">
          {Object.entries(budget.estimated).map(([key, amount]) => (
            <li key={key} className="flex items-center justify-between py-2.5 text-sm">
              <span className="capitalize text-foreground">
                {key.replace(/([A-Z])/g, " $1").toLowerCase()}
              </span>
              <span className="text-primary">{money(amount)} <span className="text-[11px] text-muted-foreground">est.</span></span>
            </li>
          ))}
          <li className="flex items-center justify-between py-3 font-display text-lg text-primary">
            <span>Estimated total</span>
            <span>{money(budget.estimatedTotal)}</span>
          </li>
        </ul>
        <div className="mt-4 rounded-xl bg-sand p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
            Live API prices
          </p>
          {budget.livePriced.length === 0 ? (
            <p className="mt-1 text-sm text-muted-foreground">
              None yet. Live fares will replace the matching estimate above, never add to it.
            </p>
          ) : (
            <ul className="mt-1 space-y-1 text-sm">
              {budget.livePriced.map((item) => (
                <li key={item.label} className="flex justify-between">
                  <span>{item.label}</span>
                  <span>{money(item.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <ul className="mt-4 space-y-1 text-xs text-muted-foreground">
          {budget.notes.map((note) => (
            <li key={note}>• {note}</li>
          ))}
        </ul>
      </section>

      <section className={card}>
        <h2 className={heading}>Inter-city transportation</h2>
        {transportLegs.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            This trip stays in one town, so no inter-city legs are needed.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {transportLegs.map((leg) => (
              <div key={`${leg.from}-${leg.to}`} className="rounded-xl border border-border p-4">
                <p className="font-medium text-foreground">
                  {leg.from} → {leg.to}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  ≈ {leg.distanceKm} km · ≈ {leg.estimatedDurationHours} hrs by road · preference:{" "}
                  {leg.preferredMode}
                </p>
                <div className="mt-3 rounded-lg border border-dashed border-border bg-sand p-3">
                  <p className="text-xs text-primary">{leg.note}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={card}>
        <h2 className={heading}>Map view</h2>
        <div className="mt-4 flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-sand p-6 text-center">
          <p className="text-sm text-primary">
            Route map will render here once the Google Maps integration is configured.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Waypoints ready: {map.waypoints.map((w) => w.city).join(" → ")}
          </p>
        </div>
      </section>
    </div>
  );
}
