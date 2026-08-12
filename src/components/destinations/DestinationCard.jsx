import { Link, useNavigate } from "react-router-dom";

export default function DestinationCard({ destination }) {
  const navigate = useNavigate();

  const destinationName = destination.country
    ? `${destination.name}, ${destination.country}`
    : destination.name;

  const handlePlanTrip = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/trips/new?destination=${encodeURIComponent(destinationName)}`);
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/60 hover:shadow-xl">
      <Link to={`/destinations/${destination.id}`} className="block">
        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
          {destination.image ? (
            <img
              src={destination.image}
              alt={destination.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl bg-slate-100">
              🌍
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />

          {destination.popularTag && (
            <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-teal-600/90 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md shadow-sm">
              🔥 {destination.popularTag}
            </span>
          )}

          {destination.category && (
            <span className="absolute right-3 top-3 rounded-full border border-white/20 bg-slate-900/80 px-2.5 py-0.5 text-[10px] font-semibold text-slate-200 backdrop-blur-md">
              {destination.category}
            </span>
          )}

          <div className="absolute bottom-3 left-3 right-3 text-white">
            <h3 className="truncate text-lg font-extrabold drop-shadow-sm">
              {destination.name}
            </h3>
            <p className="text-xs text-teal-100 font-medium">{destination.country}</p>
          </div>
        </div>
      </Link>

      <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
        <div className="flex items-center justify-between text-xs">
          {destination.rating ? (
            <span className="flex items-center gap-1 font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
              ★ {destination.rating}
            </span>
          ) : (
            <span className="text-slate-400">Top Rated</span>
          )}

          {destination.avgBudget && (
            <span className="font-semibold text-slate-600">
              Est. {destination.avgBudget}
            </span>
          )}
        </div>

        {destination.description && (
          <p className="line-clamp-2 text-xs text-slate-500 leading-relaxed">
            {destination.description}
          </p>
        )}

        <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
          <Link
            to={`/destinations/${destination.id}`}
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-2 text-center text-xs font-bold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Explore
          </Link>
          <button
            onClick={handlePlanTrip}
            className="flex-1 rounded-xl bg-teal-600 py-2 text-center text-xs font-bold text-white shadow-sm transition hover:bg-teal-700 hover:shadow-md"
            title={`Create trip to ${destinationName}`}
          >
            ➕ Plan Trip
          </button>
        </div>
      </div>
    </div>
  );
}