import { Link } from "react-router-dom";
import {
  TRIP_STATUS_LABELS,
  TRIP_STATUS_COLORS,
  formatDateShort,
  formatCurrency,
} from "../../utils/constants";

export default function TripCard({ trip }) {
  return (
    <Link
      to={`/trips/${trip.id}`}
      className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative h-36 w-full bg-slate-200">
        {trip.coverImage ? (
          <img
            src={trip.coverImage}
            alt={trip.destination}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl">
            🏝️
          </div>
        )}
        <span
          className={`absolute right-3 top-3 rounded-full px-2 py-0.5 text-xs font-medium ${
            TRIP_STATUS_COLORS[trip.status] || "bg-slate-100 text-slate-600"
          }`}
        >
          {TRIP_STATUS_LABELS[trip.status] || trip.status}
        </span>
      </div>
      <div className="p-4">
        <h3 className="truncate text-base font-semibold text-slate-900">
          {trip.destination}
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          {formatDateShort(trip.startDate)} – {formatDateShort(trip.endDate)}
        </p>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-slate-500">
            {trip.travelerCount || 1} traveler
            {(trip.travelerCount || 1) > 1 ? "s" : ""}
          </span>
          <span className="font-medium text-slate-700">
            {formatCurrency(trip.budget)}
          </span>
        </div>
      </div>
    </Link>
  );
}