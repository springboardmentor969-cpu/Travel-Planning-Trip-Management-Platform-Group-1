import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import tripApi from "../../api/tripApi";
import TripCard from "../../components/trips/TripCard";
import { TRIP_STATUS, TRIP_STATUS_LABELS } from "../../utils/constants";

export default function TripList() {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const loadTrips = async () => {
    setIsLoading(true);
    try {
      const data = await tripApi.getTrips({
        search: search || undefined,
        status: statusFilter || undefined,
      });
      setTrips(data);
    } catch (err) {
      setTrips([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(loadTrips, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter]);

  const handleDelete = async (tripId) => {
    if (!window.confirm("Delete this trip? This can't be undone.")) return;
    await tripApi.deleteTrip(tripId);
    setTrips((prev) => prev.filter((t) => t.id !== tripId));
  };

  return (
    <div className="bg-slate-50">
      {/* Full-bleed hero */}
      <div className="relative h-64 w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-emerald-900/40" />

        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-white">Your trips</h1>
              <p className="mt-1 text-emerald-100">
                Every adventure, planned and organized.
              </p>
            </div>
            <Link
              to="/trips/new"
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-emerald-700 shadow-lg transition hover:bg-emerald-50"
            >
              + New trip
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Floating filter bar */}
        <div className="-mt-8 mb-8 flex flex-wrap gap-3 rounded-2xl bg-white p-3 shadow-lg">
          <input
            type="text"
            placeholder="Search by destination…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All statuses</option>
            {Object.values(TRIP_STATUS).map((status) => (
              <option key={status} value={status}>
                {TRIP_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>

        {isLoading && (
          <p className="py-16 text-center text-sm text-slate-400">
            Loading trips…
          </p>
        )}

        {!isLoading && trips.length === 0 && (
          <div className="relative overflow-hidden rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80"
              alt=""
              className="h-64 w-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 px-6 text-center">
              <span className="mb-2 text-3xl">🏝️</span>
              <p className="mb-3 text-white">
                No trips yet — plan your first one.
              </p>
              <Link
                to="/trips/new"
                className="rounded-lg bg-white px-5 py-2 text-sm font-medium text-emerald-700 shadow-sm hover:bg-emerald-50"
              >
                Create a trip
              </Link>
            </div>
          </div>
        )}

        {!isLoading && trips.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <div key={trip.id} className="relative">
                <TripCard trip={trip} />
                <button
                  onClick={() => handleDelete(trip.id)}
                  className="absolute left-3 top-3 rounded-full bg-white/90 p-1.5 text-slate-500 shadow hover:text-red-500"
                  title="Delete trip"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}