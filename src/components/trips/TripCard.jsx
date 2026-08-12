import { Link } from "react-router-dom";
import {
  TRIP_STATUS_LABELS,
  TRIP_STATUS_COLORS,
  formatDateShort,
  formatCurrency,
} from "../../utils/constants";

const DESTINATION_IMAGES = {
  tokyo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80",
  paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80",
  goa: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80",
  bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80",
  london: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80",
  newyork: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80",
};

export default function TripCard({ trip }) {
  const destLower = (trip.destination || "").toLowerCase().trim();
  const matchedKey = Object.keys(DESTINATION_IMAGES).find((k) => destLower.includes(k));
  const imageSrc =
    trip.coverImage ||
    (matchedKey
      ? DESTINATION_IMAGES[matchedKey]
      : "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80");

  return (
    <Link
      to={`/trips/${trip.id}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/50 hover:shadow-xl"
    >
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        <img
          src={imageSrc}
          alt={trip.destination}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
        
        <span
          className={`absolute right-3 top-3 rounded-full border border-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md shadow-sm ${
            TRIP_STATUS_COLORS[trip.status] || "bg-slate-900/80 text-white"
          }`}
        >
          {TRIP_STATUS_LABELS[trip.status] || trip.status}
        </span>

        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="truncate text-lg font-bold drop-shadow-sm">
            {trip.destination}
          </h3>
        </div>
      </div>

      <div className="p-4 space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1 font-medium text-slate-600">
            <span>🗓️</span> {formatDateShort(trip.startDate)} – {formatDateShort(trip.endDate)}
          </span>
          <span className="flex items-center gap-1 text-slate-500">
            <span>👥</span> {trip.travelerCount || 1} traveler{(trip.travelerCount || 1) > 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-2.5">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Budget</span>
          <span className="text-sm font-bold text-teal-700">
            {formatCurrency(trip.budget)}
          </span>
        </div>
      </div>
    </Link>
  );
}