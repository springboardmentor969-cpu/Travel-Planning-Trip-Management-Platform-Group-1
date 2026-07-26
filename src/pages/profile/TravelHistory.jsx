import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import tripApi from "../../api/tripApi";
import { TRIP_STATUS, formatDate, formatCurrency } from "../../utils/constants";

export default function TravelHistory() {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    tripApi
      .getTrips({ status: TRIP_STATUS.COMPLETED })
      .then(setTrips)
      .catch(() => setTrips([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 text-white">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <Link to="/profile" className="text-sm text-slate-300 hover:underline">
            ← Profile
          </Link>
          <h1 className="mt-2 text-2xl font-semibold">📜 Travel history</h1>
          <p className="mt-1 text-slate-300">
            Every trip you've completed with TripNest.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8">
        {isLoading && (
          <p className="py-10 text-center text-sm text-slate-400">Loading…</p>
        )}

        {!isLoading && trips.length === 0 && (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 py-14 text-center">
            <span className="mb-2 text-3xl">🧳</span>
            <p className="text-sm text-slate-400">
              No completed trips yet — your history will show up here.
            </p>
          </div>
        )}

        {!isLoading && trips.length > 0 && (
          <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white shadow-sm">
            {trips.map((trip) => (
              <Link
                key={trip.id}
                to={`/trips/${trip.id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-slate-50"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {trip.destination}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                  </p>
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {formatCurrency(trip.budget)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}