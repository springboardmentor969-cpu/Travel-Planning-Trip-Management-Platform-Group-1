import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import tripApi from "../../api/tripApi";
import {
  TRIP_STATUS_LABELS,
  TRIP_STATUS_COLORS,
  formatDate,
  formatCurrency,
} from "../../utils/constants";
import TripTimeline from "../../components/trips/TripTimeline";
import ItineraryPlanner from "../itinerary/ItineraryPlanner";
import BudgetExpense from "../budget/BudgetExpense";
import GroupCollaboration from "../groups/GroupCollaboration";
import DocumentManager from "../media/DocumentManager";

const TABS = [
  { key: "itinerary", label: "Itinerary", icon: "🗓️" },
  { key: "budget", label: "Budget & Expenses", icon: "💰" },
  { key: "group", label: "Group", icon: "👥" },
  { key: "documents", label: "Documents", icon: "📄" },
  { key: "timeline", label: "Timeline", icon: "📍" },
];

const DESTINATION_HEROES = {
  tokyo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1920&q=80",
  paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1920&q=80",
  goa: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1920&q=80",
  bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1920&q=80",
  london: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1920&q=80",
  newyork: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1920&q=80",
};

export default function TripDetail() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("itinerary");
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [shareEmail, setShareEmail] = useState("");
  const [shareMessage, setShareMessage] = useState("");

  useEffect(() => {
    tripApi
      .getTripById(tripId)
      .then(setTrip)
      .finally(() => setIsLoading(false));
  }, [tripId]);

  useEffect(() => {
    if (activeTab === "timeline") {
      tripApi.getTripTimeline(tripId).then(setTimelineEvents).catch(() => {});
    }
  }, [activeTab, tripId]);

  const handleShare = async (e) => {
    e.preventDefault();
    setShareMessage("");
    if (!shareEmail) return;
    try {
      await tripApi.shareTrip(tripId, shareEmail);
      setShareMessage(`Invite sent to ${shareEmail}.`);
      setShareEmail("");
    } catch (err) {
      setShareMessage("Could not share this trip.");
    }
  };

  if (isLoading) {
    return (
      <p className="py-16 text-center text-sm text-slate-400">Loading trip details…</p>
    );
  }

  if (!trip) {
    return (
      <div className="py-16 text-center">
        <p className="mb-3 text-sm text-slate-500">Trip not found.</p>
        <Link to="/trips" className="text-sm font-semibold text-teal-600 hover:underline">
          ← Back to all trips
        </Link>
      </div>
    );
  }

  const destLower = (trip.destination || "").toLowerCase().trim();
  const matchedKey = Object.keys(DESTINATION_HEROES).find((k) => destLower.includes(k));
  const heroSrc =
    trip.coverImage ||
    (matchedKey
      ? DESTINATION_HEROES[matchedKey]
      : "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1920&q=80");

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Dynamic Header Banner with Picture */}
      <div className="relative h-72 w-full overflow-hidden sm:h-80">
        <img
          src={heroSrc}
          alt={trip.destination}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-slate-900/20" />

        <div className="relative mx-auto flex h-full max-w-5xl flex-col justify-between px-4 py-6">
          <Link
            to="/trips"
            className="inline-flex items-center gap-1 text-xs font-semibold text-teal-200 hover:text-white"
          >
            ← Back to all trips
          </Link>

          <div className="flex flex-wrap items-end justify-between gap-4 pb-2">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-white drop-shadow-sm sm:text-4xl">
                  {trip.destination}
                </h1>
                <span
                  className={`rounded-full border border-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md shadow-sm ${
                    TRIP_STATUS_COLORS[trip.status] || "bg-slate-900/80 text-white"
                  }`}
                >
                  {TRIP_STATUS_LABELS[trip.status] || trip.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-teal-100">
                <span>🗓️</span> {formatDate(trip.startDate)} – {formatDate(trip.endDate)} ·{" "}
                <span>👥</span> {trip.travelerCount || 1} traveler
                {(trip.travelerCount || 1) > 1 ? "s" : ""} ·{" "}
                <span className="font-semibold text-white">💰 {formatCurrency(trip.budget)}</span>
              </p>
            </div>

            <Link
              to={`/trips/${tripId}/edit`}
              className="rounded-xl bg-white/90 px-4 py-2 text-xs font-bold text-slate-800 shadow-md backdrop-blur-sm transition hover:bg-white hover:text-teal-700"
            >
              ✏️ Edit trip
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 space-y-6">
        {/* Share trip form card */}
        <form
          onSubmit={handleShare}
          className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            👥 Invite Travel Buddy:
          </span>
          <input
            type="email"
            placeholder="friend@example.com"
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
            className="flex-1 min-w-[200px] rounded-xl border border-slate-300 px-3.5 py-1.5 text-xs outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          />
          <button
            type="submit"
            className="rounded-xl bg-teal-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-teal-700 transition"
          >
            Send invite
          </button>
          {shareMessage && (
            <span className="text-xs font-medium text-teal-600">{shareMessage}</span>
          )}
        </form>

        {/* Tab Navigation with colored active borders */}
        <div className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-xl border px-4 py-2.5 text-xs font-bold transition-all ${
                activeTab === tab.key
                  ? "border-teal-600 bg-teal-50/80 text-teal-700 shadow-sm"
                  : "border-transparent bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active Tab Content */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          {activeTab === "itinerary" && <ItineraryPlanner tripId={tripId} />}
          {activeTab === "budget" && <BudgetExpense tripId={tripId} />}
          {activeTab === "group" && <GroupCollaboration tripId={tripId} />}
          {activeTab === "documents" && <DocumentManager tripId={tripId} />}
          {activeTab === "timeline" && <TripTimeline events={timelineEvents} />}
        </div>
      </div>
    </div>
  );
}