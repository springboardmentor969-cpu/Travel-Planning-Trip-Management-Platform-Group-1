import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import destinationApi from "../../api/destinationApi";
import { getFeaturedPlaceById } from "../../data/destinationsData";

export default function DestinationDetail() {
  const { destinationId } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [attractions, setAttractions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  const handleToggleFavorite = async () => {
    setIsTogglingFavorite(true);
    try {
      if (isFavorite) {
        await destinationApi.removeFavorite(destinationId);
      } else {
        await destinationApi.addFavorite(destinationId);
      }
      setIsFavorite((prev) => !prev);
    } catch (e) {
      setIsFavorite((prev) => !prev);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    
    // First check local featured places database
    const localPlace = getFeaturedPlaceById(destinationId);

    Promise.all([
      destinationApi.getDestinationById(destinationId).catch(() => localPlace),
      destinationApi.getAttractions(destinationId).catch(() => localPlace?.attractions || []),
      destinationApi.getWeather(destinationId).catch(() => ({
        current: { temp: 24, condition: "Sunny & Pleasant" }
      })),
    ])
      .then(([dest, attr, weatherData]) => {
        const finalDest = dest || localPlace;
        setDestination(finalDest);
        setAttractions(attr && attr.length > 0 ? attr : (finalDest?.attractions || []));
        setWeather(weatherData || { current: { temp: 24, condition: "Sunny & Pleasant" } });
        setIsFavorite(!!finalDest?.isFavorite);
      })
      .finally(() => setIsLoading(false));
  }, [destinationId]);

  const handlePlanTrip = () => {
    if (!destination) return;
    const destName = destination.country
      ? `${destination.name}, ${destination.country}`
      : destination.name;
    navigate(`/trips/new?destination=${encodeURIComponent(destName)}`);
  };

  if (isLoading) {
    return (
      <p className="py-16 text-center text-sm font-medium text-slate-400">
        Loading destination details…
      </p>
    );
  }

  if (!destination) {
    return (
      <div className="py-16 text-center">
        <p className="mb-3 text-sm text-slate-500">Destination details not found.</p>
        <Link
          to="/destinations"
          className="text-sm font-bold text-teal-600 hover:underline"
        >
          ← Back to Explore
        </Link>
      </div>
    );
  }

  const destinationFullName = destination.country
    ? `${destination.name}, ${destination.country}`
    : destination.name;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Full-width hero cover photo */}
      <div className="relative h-80 w-full overflow-hidden bg-slate-900 sm:h-96">
        {destination.image ? (
          <img
            src={destination.image}
            alt={destination.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-600 to-indigo-800 text-5xl">
            🌍
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-4xl px-4 pb-8 text-white flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link
              to="/destinations"
              className="mb-2 inline-flex items-center gap-1 text-xs font-bold text-teal-200 hover:text-white"
            >
              ← Back to Explore
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold sm:text-4xl drop-shadow-sm">
                {destination.name}
              </h1>
              <button
                onClick={handleToggleFavorite}
                disabled={isTogglingFavorite}
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                className={`text-2xl leading-none transition ${
                  isFavorite ? "text-amber-400" : "text-white/60 hover:text-amber-400"
                }`}
              >
                ★
              </button>
            </div>
            <p className="text-sm font-semibold text-teal-100 mt-1">
              📍 {destination.country} {destination.category ? `· ${destination.category}` : ""}
            </p>
          </div>

          {/* Action Button: Create Trip to Destination */}
          <button
            onClick={handlePlanTrip}
            className="rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-3.5 text-xs font-extrabold text-white shadow-xl hover:from-teal-500 hover:to-emerald-500 transition-all hover:-translate-y-0.5"
          >
            ➕ Create Trip to {destination.name}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
        {/* Weather & Budget Badges */}
        <div className="flex flex-wrap items-center gap-4">
          {weather?.current && (
            <div className="inline-flex items-center gap-3.5 rounded-2xl border border-slate-200/90 bg-white px-5 py-3 shadow-xs">
              <span className="text-3xl">☀️</span>
              <div>
                <p className="text-base font-extrabold text-slate-900">
                  {weather.current.temp}°C
                </p>
                <p className="text-xs font-medium text-slate-500">
                  {weather.current.condition}
                </p>
              </div>
            </div>
          )}

          {destination.avgBudget && (
            <div className="inline-flex items-center gap-3.5 rounded-2xl border border-slate-200/90 bg-white px-5 py-3 shadow-xs">
              <span className="text-3xl">💰</span>
              <div>
                <p className="text-base font-extrabold text-slate-900">
                  {destination.avgBudget}
                </p>
                <p className="text-xs font-medium text-slate-500">
                  Est. Trip Budget
                </p>
              </div>
            </div>
          )}

          {destination.rating && (
            <div className="inline-flex items-center gap-3.5 rounded-2xl border border-slate-200/90 bg-white px-5 py-3 shadow-xs">
              <span className="text-3xl">⭐</span>
              <div>
                <p className="text-base font-extrabold text-slate-900">
                  {destination.rating} / 5.0
                </p>
                <p className="text-xs font-medium text-slate-500">
                  Traveler Rating
                </p>
              </div>
            </div>
          )}
        </div>

        {destination.description && (
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              📖 About {destination.name}
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              {destination.description}
            </p>
          </div>
        )}

        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            📍 Top Attractions in {destination.name}
          </h2>
          {attractions.length === 0 ? (
            <p className="text-xs text-slate-400">
              No attractions listed yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {attractions.map((a) => (
                <div key={a.id || a.name} className="overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50">
                  <div className="h-36 w-full overflow-hidden bg-slate-200">
                    {a.image && (
                      <img
                        src={a.image}
                        alt={a.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-bold text-slate-900">{a.name}</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{a.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {destination.travelGuide && (
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              💡 Travel Guide & Tips
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              {destination.travelGuide}
            </p>
          </div>
        )}

        {/* Bottom Banner to Create Trip */}
        <div className="rounded-3xl border border-teal-200 bg-gradient-to-r from-teal-50 via-emerald-50 to-white p-6 text-center shadow-sm flex flex-col items-center">
          <h3 className="text-lg font-bold text-slate-900">Ready to visit {destination.name}?</h3>
          <p className="text-xs text-slate-600 mt-1 mb-4">Set dates, budget, and invite travel companions to create your trip now.</p>
          <button
            onClick={handlePlanTrip}
            className="rounded-2xl bg-teal-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-teal-700 transition"
          >
            🚀 Create Trip to {destinationFullName} Now
          </button>
        </div>
      </div>
    </div>
  );
}