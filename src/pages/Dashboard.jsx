import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLE_LABELS } from "../utils/roles";
import analyticsApi from "../api/analyticsApi";
import { formatCurrency } from "../utils/constants";
import StatCard from "../components/dashboard/StatCard";
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome, {user?.name}
        </h1>
        <p className="text-sm text-slate-500">
          {ROLE_LABELS[user?.role] || user?.role}
        </p>
      </div>

      {isLoading && (
        <p className="py-10 text-center text-sm text-slate-400">
          Loading your dashboard…
        </p>
      )}

      {!isLoading && (
        <>
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard
              icon="🧳"
              label="Total trips"
              value={stats.totalTrips ?? "—"}
              accent="teal"
            />
            <StatCard
              icon="🌍"
              label="Countries visited"
              value={stats.countriesVisited ?? "—"}
              accent="blue"
            />
            <StatCard
              icon="💰"
              label="Total spent"
              value={formatCurrency(expenseSummary.totalSpent || 0)}
              accent="amber"
            />
            <StatCard
              icon="🗓️"
              label="Days travelled"
              value={stats.totalDaysTravelled ?? "—"}
              accent="purple"
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900">
                  Upcoming trips
                </h2>
                <Link
                  to="/trips"
                  className="text-sm text-teal-600 hover:underline"
                >
                  View all
                </Link>
              </div>
              <div className="space-y-2 rounded-2xl bg-white p-3 shadow-sm">
                {upcomingTrips.length === 0 && (
                  <p className="py-8 text-center text-sm text-slate-400">
                    No upcoming trips — time to plan one.
                  </p>
                )}
                {upcomingTrips.map((trip) => (
                  <UpcomingTripCard key={trip.id} trip={trip} />
                ))}
              </div>

              {favoriteDestinations.length > 0 && (
                <div className="mt-8">
                  <h2 className="mb-3 text-base font-semibold text-slate-900">
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

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-base font-semibold text-slate-900">
                Budget overview
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total planned</span>
                  <span className="font-medium text-slate-900">
                    {formatCurrency(budgetOverview.totalPlanned || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total spent</span>
                  <span className="font-medium text-slate-900">
                    {formatCurrency(expenseSummary.totalSpent || 0)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-3">
                  <span className="text-slate-500">Remaining</span>
                  <span className="font-medium text-teal-700">
                    {formatCurrency(
                      (budgetOverview.totalPlanned || 0) -
                        (expenseSummary.totalSpent || 0)
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}