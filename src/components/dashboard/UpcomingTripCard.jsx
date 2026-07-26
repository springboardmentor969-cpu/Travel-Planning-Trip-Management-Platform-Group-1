import { Link } from "react-router-dom";
import { formatDateShort, formatCurrency } from "../../utils/constants";

export default function UpcomingTripCard({ trip }) {
  return (
    <Link
      to={`/trips/${trip.id}`}
      className="flex items-center justify-between rounded-xl border border-slate-100 p-3 hover:bg-slate-50"
    >
      <div>
        <p className="text-sm font-medium text-slate-900">
          {trip.destination}
        </p>
        <p className="text-xs text-slate-500">
          {formatDateShort(trip.startDate)} – {formatDateShort(trip.endDate)}
        </p>
      </div>
      <span className="text-sm font-medium text-slate-700">
        {formatCurrency(trip.budget)}
      </span>
    </Link>
  );
}