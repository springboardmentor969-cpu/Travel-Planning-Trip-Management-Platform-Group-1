import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLE_LABELS } from "../utils/roles";
import analyticsApi from "../api/analyticsApi";
import { formatCurrency } from "../utils/constants";
import UpcomingTripCard from "../components/dashboard/UpcomingTripCard";
import DestinationCard from "../components/destinations/DestinationCard";

const TRAVEL_QUOTES = [
  { quote: "The world is a book and those who do not travel read only one page.", author: "Saint Augustine" },
  { quote: "Traveling – it leaves you speechless, then turns you into a storyteller.", author: "Ibn Battuta" },
  { quote: "Take only memories, leave only footprints.", author: "Chief Seattle" },
  { quote: "To travel is to live.", author: "Hans Christian Andersen" },
  { quote: "Jobs fill your pocket, but adventures fill your soul.", author: "Jaime Lyn Beatty" },
  { quote: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const nextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % TRAVEL_QUOTES.length);
  };

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
    <div className="bg-slate-50 min-h-screen">
      {/* Full-bleed hero banner with high quality travel picture */}
      <div className="relative w-full min-h-[340px] py-12 overflow-hidden bg-slate-900">
        <img
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1920&q=80"
          alt="TripNest Dashboard Banner"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/60 to-teal-950/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-950/80 via-slate-950/40 to-transparent" />

        <div className="relative mx-auto flex max-w-6xl flex-col justify-end px-4 pb-14">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/30 bg-teal-900/60 px-3 py-1 text-xs font-semibold text-teal-200 backdrop-blur-md w-max">
              <span>📅</span> {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </span>
            <span className="rounded-full bg-teal-800/70 px-3 py-1 text-xs font-semibold text-teal-200 border border-teal-500/30 backdrop-blur-md">
              {ROLE_LABELS[user?.role] || user?.role}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl drop-shadow-md">
            Welcome to TripNest, {user?.name ? user.name.split(" ")[0] : "Traveler"}! 👋
          </h1>
          <p className="mt-1 text-sm font-medium text-teal-100 mb-4">
            Where is your next adventure taking you?
          </p>

          {/* Borderless High-Contrast Travel Quote directly above stat cards */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-teal-400/30 pt-3">
            <p className="text-sm font-serif italic text-amber-200 drop-shadow-md sm:text-base max-w-2xl leading-relaxed">
              ✨ “{TRAVEL_QUOTES[quoteIndex].quote}” — <span className="font-sans not-italic font-bold text-white">{TRAVEL_QUOTES[quoteIndex].author}</span>
            </p>
            <button
              onClick={nextQuote}
              className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-teal-100 hover:bg-white/30 hover:text-white backdrop-blur-md transition cursor-pointer border border-white/20 shadow-sm"
              title="Next quote"
            >
              <span>🔄</span> Next quote
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4">
        {/* Floating stat cards in green shade with smaller font size */}
        <div className="-mt-12 mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-emerald-200/90 bg-emerald-50/95 p-4 shadow-md backdrop-blur-md transition hover:-translate-y-1 hover:border-emerald-400 hover:shadow-lg">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-lg text-emerald-800 border border-emerald-300/80">
              🧳
            </div>
            <p className="text-lg font-bold text-slate-900 tracking-tight">
              {isLoading ? "—" : stats.totalTrips ?? 0}
            </p>
            <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mt-0.5">Total trips</p>
          </div>

          <div className="rounded-2xl border border-emerald-200/90 bg-emerald-50/95 p-4 shadow-md backdrop-blur-md transition hover:-translate-y-1 hover:border-emerald-400 hover:shadow-lg">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-lg text-emerald-800 border border-emerald-300/80">
              🌍
            </div>
            <p className="text-lg font-bold text-slate-900 tracking-tight">
              {isLoading ? "—" : stats.countriesVisited ?? 0}
            </p>
            <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mt-0.5">Countries visited</p>
          </div>

          <div className="rounded-2xl border border-emerald-200/90 bg-emerald-50/95 p-4 shadow-md backdrop-blur-md transition hover:-translate-y-1 hover:border-emerald-400 hover:shadow-lg">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-lg text-emerald-800 border border-emerald-300/80">
              💰
            </div>
            <p className="text-lg font-bold text-slate-900 tracking-tight">
              {isLoading ? "—" : formatCurrency(expenseSummary.totalSpent || 0)}
            </p>
            <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mt-0.5">Total spent</p>
          </div>

          <div className="rounded-2xl border border-emerald-200/90 bg-emerald-50/95 p-4 shadow-md backdrop-blur-md transition hover:-translate-y-1 hover:border-emerald-400 hover:shadow-lg">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-lg text-emerald-800 border border-emerald-300/80">
              🗓️
            </div>
            <p className="text-lg font-bold text-slate-900 tracking-tight">
              {isLoading ? "—" : stats.totalDaysTravelled ?? 0}
            </p>
            <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mt-0.5">Days travelled</p>
          </div>
        </div>

        {isLoading && (
          <p className="pb-16 text-center text-sm font-medium text-slate-400">
            Loading your dashboard stats…
          </p>
        )}

        {!isLoading && (
          <div className="grid gap-8 pb-16 lg:grid-cols-3">
            {/* Left: upcoming trips + featured travel picture card */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Upcoming Trips
                  </h2>
                  <Link
                    to="/trips"
                    className="text-xs font-bold text-teal-600 hover:text-teal-700 hover:underline"
                  >
                    View all trips →
                  </Link>
                </div>

                {upcomingTrips.length === 0 ? (
                  <div className="relative overflow-hidden rounded-3xl border border-slate-200 shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80"
                      alt="Plan Next Trip"
                      className="h-60 w-full object-cover"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/65 px-6 text-center backdrop-blur-xs">
                      <span className="mb-2 text-3xl">✈️</span>
                      <h3 className="text-lg font-bold text-white mb-1">
                        No upcoming trips scheduled
                      </h3>
                      <p className="mb-4 text-xs font-medium text-slate-200 max-w-sm">
                        Start planning your next getaway. Set dates, budget, and invite travel companions.
                      </p>
                      <Link
                        to="/trips/new"
                        className="rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-teal-700 transition"
                      >
                        + Plan Your Next Trip
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingTrips.map((trip) => (
                      <UpcomingTripCard key={trip.id} trip={trip} />
                    ))}
                  </div>
                )}
              </div>

              {/* Featured Travel Picture Banner */}
              <div className="relative overflow-hidden rounded-3xl border border-teal-200/90 bg-white shadow-md">
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
                    alt="Featured Destination"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <span className="rounded-full bg-teal-500/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                        🌟 Featured Inspiration
                      </span>
                      <h3 className="mt-1.5 text-xl font-bold text-white drop-shadow">
                        Tropical Beaches & Coastal Getaways
                      </h3>
                    </div>
                    <Link
                      to="/destinations"
                      className="rounded-xl bg-white px-3.5 py-1.5 text-xs font-bold text-slate-900 shadow hover:bg-teal-50 transition"
                    >
                      Explore →
                    </Link>
                  </div>
                </div>
              </div>

              {favoriteDestinations.length > 0 && (
                <div>
                  <h2 className="mb-4 text-xl font-extrabold text-slate-900 tracking-tight">
                    Your Favorite Destinations
                  </h2>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {favoriteDestinations.map((d) => (
                      <DestinationCard key={d.id} destination={d} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Budget Overview + ENHANCED QUICK ACTIONS UI */}
            <div className="space-y-6">
              {/* Budget Overview Card */}
              <div className="overflow-hidden rounded-3xl border border-teal-700/30 bg-gradient-to-br from-teal-700 via-teal-800 to-emerald-900 p-6 text-white shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xs font-extrabold uppercase tracking-wider text-teal-200">
                    Budget Overview
                  </h2>
                  <span className="text-xs font-bold bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
                    {percentSpent}% Spent
                  </span>
                </div>

                <div className="mb-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-950/40 p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${percentSpent >= 100 ? "bg-rose-400" : "bg-teal-300"}`}
                    style={{ width: `${percentSpent}%` }}
                  />
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-teal-200">Total Planned</span>
                    <span className="font-bold text-white">
                      {formatCurrency(budgetOverview.totalPlanned || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-teal-200">Total Spent</span>
                    <span className="font-bold text-white">
                      {formatCurrency(expenseSummary.totalSpent || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-white/15 pt-2.5 text-sm">
                    <span className="font-medium text-teal-100">Remaining</span>
                    <span className={`font-bold ${remaining < 0 ? "text-rose-300" : "text-emerald-300"}`}>
                      {formatCurrency(remaining)}
                    </span>
                  </div>
                </div>
              </div>

              {/* ENHANCED QUICK ACTIONS UI CARD */}
              <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-md">
                <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                  <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                    ⚡ Quick Actions
                  </h2>
                  <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                    Shortcuts
                  </span>
                </div>

                <div className="space-y-3">
                  <Link
                    to="/trips/new"
                    className="group flex items-center justify-between rounded-2xl border border-teal-200/80 bg-gradient-to-r from-teal-50/70 via-emerald-50/40 to-white p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-400 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-lg text-white shadow-sm transition group-hover:scale-105">
                        🧭
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-teal-700">
                          Plan a New Trip
                        </p>
                        <p className="text-[11px] text-slate-500">Set dates, budget & destination</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-teal-600 transition group-hover:translate-x-1">→</span>
                  </Link>

                  <Link
                    to="/destinations"
                    className="group flex items-center justify-between rounded-2xl border border-sky-200/80 bg-gradient-to-r from-sky-50/70 via-blue-50/40 to-white p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-400 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-lg text-white shadow-sm transition group-hover:scale-105">
                        🌍
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-sky-700">
                          Explore Destinations
                        </p>
                        <p className="text-[11px] text-slate-500">Discover popular travel spots</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-sky-600 transition group-hover:translate-x-1">→</span>
                  </Link>

                  <Link
                    to="/profile"
                    className="group flex items-center justify-between rounded-2xl border border-purple-200/80 bg-gradient-to-r from-purple-50/70 via-pink-50/40 to-white p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-purple-400 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-lg text-white shadow-sm transition group-hover:scale-105">
                        👤
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-purple-700">
                          Account Profile
                        </p>
                        <p className="text-[11px] text-slate-500">Update preferences & security</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-purple-600 transition group-hover:translate-x-1">→</span>
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