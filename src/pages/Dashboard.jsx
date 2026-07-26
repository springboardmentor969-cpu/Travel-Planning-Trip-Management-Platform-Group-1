import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLE_LABELS } from "../utils/roles";
import analyticsApi from "../api/analyticsApi";
import { formatCurrency } from "../utils/constants";
import UpcomingTripCard from "../components/dashboard/UpcomingTripCard";
import DestinationCard from "../components/destinations/DestinationCard";

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    analyticsApi
      .getDashboardSummary()
      .then(setSummary)
      .catch(() => setSummary(null))
      .finally(() => setIsLoading(false));
  }, []);

  const upcomingTrips = summary?.upcomingTrips || [];
  const stats = summary?.travelStats || {};
  const budgetOverview = summary?.budgetOverview || {};
  const expenseSummary = summary?.expenseSummary || {};
  const favoriteDestinations = summary?.favoriteDestinations || [];
  const remaining = (budgetOverview.totalPlanned || 0) - (expenseSummary.totalSpent || 0);
  const percentSpent = budgetOverview.totalPlanned
    ? Math.min(100, Math.round(((expenseSummary.totalSpent || 0) / budgetOverview.totalPlanned) * 100))
    : 0;

  return (
    <div className="bg-slate-50">
      {/* Full-bleed hero */}
      <div className="relative h-72 w-full overflow-hidden sm:h-80">
        <img
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-slate-900/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/60 to-transparent" />

        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-16">
          <p className="text-sm font-medium text-teal-200">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <h1 className="mt-1 text-3xl font-semibold text-white sm:text-4xl">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="mt-2 text-teal-100">
            {ROLE_LABELS[user?.role] || user?.role} · Where's your next adventure taking you?
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4">
        {/* Floating glass stat cards, overlapping the hero */}
        <div className="-mt-12 mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 text-lg">
              🧳
            </div>
            <p className="text-xl font-semibold text-slate-900">
              {isLoading ? "—" : stats.totalTrips ?? 0}
            </p>
            <p className="text-xs text-slate-500">Total trips</p>
          </div>
          <div className="rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-lg">
              🌍
            </div>
            <p className="text-xl font-semibold text-slate-900">
              {isLoading ? "—" : stats.countriesVisited ?? 0}
            </p>
            <p className="text-xs text-slate-500">Countries visited</p>
          </div>
          <div className="rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-lg">
              💰
            </div>
            <p className="text-xl font-semibold text-slate-900">
              {isLoading ? "—" : formatCurrency(expenseSummary.totalSpent || 0)}
            </p>
            <p className="text-xs text-slate-500">Total spent</p>
          </div>
          <div className="rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-lg">
              🗓️
            </div>
            <p className="text-xl font-semibold text-slate-900">
              {isLoading ? "—" : stats.totalDaysTravelled ?? 0}
            </p>
            <p className="text-xs text-slate-500">Days travelled</p>
          </div>
        </div>

        {isLoading && (
          <p className="pb-16 text-center text-sm text-slate-400">
            Loading your dashboard…
          </p>
        )}

        {!isLoading && (
          <div className="grid gap-6 pb-16 lg:grid-cols-3">
            {/* Left: upcoming trips + favorites */}
            <div className="lg:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  Upcoming trips
                </h2>
                <Link
                  to="/trips"
                  className="text-sm font-medium text-teal-600 hover:underline"
                >
                  View all →
                </Link>
              </div>

              {upcomingTrips.length === 0 ? (
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80"
                    alt=""
                    className="h-56 w-full object-cover"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 px-6 text-center">
                    <p className="mb-3 text-white">
                      No upcoming trips yet — your next story starts here.
                    </p>
                    <Link
                      to="/trips/new"
                      className="rounded-lg bg-white px-5 py-2 text-sm font-medium text-teal-700 shadow-sm hover:bg-teal-50"
                    >
                      + Plan your first trip
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 rounded-2xl bg-white p-3 shadow-sm">
                  {upcomingTrips.map((trip) => (
                    <UpcomingTripCard key={trip.id} trip={trip} />
                  ))}
                </div>
              )}

              {favoriteDestinations.length > 0 && (
                <div className="mt-8">
                  <h2 className="mb-3 text-lg font-semibold text-slate-900">
                    Your favorite destinations
                  </h2>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {favoriteDestinations.map((d) => (
                      <DestinationCard key={d.id} destination={d} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: budget + quick actions */}
            <div className="space-y-5">
              <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-700 p-5 text-white shadow-sm">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-teal-100">
                  Budget overview
                </h2>

                <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-white/20">
                  <div
                    className={`h-full rounded-full ${percentSpent >= 100 ? "bg-red-400" : "bg-white"}`}
                    style={{ width: `${percentSpent}%` }}
                  />
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-teal-100">Planned</span>
                    <span className="font-medium">
                      {formatCurrency(budgetOverview.totalPlanned || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-teal-100">Spent</span>
                    <span className="font-medium">
                      {formatCurrency(expenseSummary.totalSpent || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-white/20 pt-2">
                    <span className="text-teal-100">Remaining</span>
                    <span className="font-semibold">
                      {formatCurrency(remaining)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <h2 className="mb-3 text-sm font-semibold text-slate-900">
                  Quick actions
                </h2>
                <div className="space-y-2">
                  <Link
                    to="/trips/new"
                    className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 text-sm font-medium text-slate-700 transition hover:bg-teal-50 hover:text-teal-700"
                  >
                    <span className="text-lg">🧭</span> Plan a new trip
                  </Link>
                  <Link
                    to="/destinations"
                    className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 text-sm font-medium text-slate-700 transition hover:bg-sky-50 hover:text-sky-700"
                  >
                    <span className="text-lg">🌍</span> Explore destinations
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 text-sm font-medium text-slate-700 transition hover:bg-pink-50 hover:text-pink-700"
                  >
                    <span className="text-lg">👤</span> Edit your profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}