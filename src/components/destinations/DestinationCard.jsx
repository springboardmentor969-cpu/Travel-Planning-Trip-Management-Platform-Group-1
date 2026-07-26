import { Link } from "react-router-dom";

export default function DestinationCard({ destination }) {
  return (
    <Link
      to={`/destinations/${destination.id}`}
      className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative h-40 w-full bg-slate-200">
        {destination.image ? (
          <img
            src={destination.image}
            alt={destination.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl">
            🌍
          </div>
        )}
        {destination.popularTag && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-teal-700">
            {destination.popularTag}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-base font-semibold text-slate-900">
          {destination.name}
        </h3>
        <p className="text-sm text-slate-500">{destination.country}</p>
        {destination.rating && (
          <p className="mt-2 flex items-center gap-1 text-sm text-amber-500">
            ★ <span className="text-slate-600">{destination.rating}</span>
          </p>
        )}
      </div>
    </Link>
  );
}