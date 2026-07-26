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
      <p className="py-16 text-center text-sm text-slate-400">Loading…</p>
    );
  }

  if (!trip) {
    return (
      <div className="py-16 text-center">
        <p className="mb-3 text-sm text-slate-500">Trip not found.</p>
        <Link to="/trips" className="text-sm text-teal-600 hover:underline">
          Back to trips
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 to-teal-800 text-white">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 py-8">
          <Link
            to="/trips"
            className="mb-3 inline-block text-sm text-teal-100 hover:underline"
          >
            ← All trips
          </Link>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold sm:text-3xl">
                  {trip.destination}
                </h1>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    TRIP_STATUS_COLORS[trip.status] || "bg-slate-100 text-slate-600"
                  }`}
                >
                  {TRIP_STATUS_LABELS[trip.status] || trip.status}
                </span>
              </div>
              <p className="mt-1 text-teal-100">
                {formatDate(trip.startDate)} – {formatDate(trip.endDate)} ·{" "}
                {trip.travelerCount || 1} traveler
                {(trip.travelerCount || 1) > 1 ? "s" : ""} ·{" "}
                {formatCurrency(trip.budget)} budget
              </p>
            </div>
            <Link
              to={`/trips/${tripId}/edit`}
              className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-teal-700 shadow-sm hover:bg-teal-50"
            >
              Edit trip
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <form
          onSubmit={handleShare}
          className="mb-6 flex flex-wrap items-center gap-2 rounded-2xl bg-white p-4 shadow-sm"
        >
          <span className="text-sm font-medium text-slate-700">
            Share this trip:
          </span>
          <input
            type="email"
            placeholder="friend@example.com"
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
            className="flex-1 min-w-[180px] rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            type="submit"
            className="rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-700"
          >
            Send invite
          </button>
          {shareMessage && (
            <span className="text-xs text-slate-500">{shareMessage}</span>
          )}
        </form>

        <div className="mb-5 flex gap-1 overflow-x-auto border-b border-slate-200">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium transition ${
                activeTab === tab.key
                  ? "border-teal-600 text-teal-700"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "itinerary" && <ItineraryPlanner tripId={tripId} />}
        {activeTab === "budget" && <BudgetExpense tripId={tripId} />}
        {activeTab === "group" && <GroupCollaboration tripId={tripId} />}
        {activeTab === "documents" && <DocumentManager tripId={tripId} />}
        {activeTab === "timeline" && <TripTimeline events={timelineEvents} />}
      </div>
    </div>
  );
}