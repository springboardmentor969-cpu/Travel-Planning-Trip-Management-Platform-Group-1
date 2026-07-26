import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import destinationApi from "../../api/destinationApi";

export default function DestinationDetail() {
  const { destinationId } = useParams();
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
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      destinationApi.getDestinationById(destinationId),
      destinationApi.getAttractions(destinationId).catch(() => []),
      destinationApi.getWeather(destinationId).catch(() => null),
    ])
      .then(([dest, attr, weatherData]) => {
        setDestination(dest);
        setAttractions(attr);
        setWeather(weatherData);
        setIsFavorite(!!dest.isFavorite);
      })
      .finally(() => setIsLoading(false));
  }, [destinationId]);

  if (isLoading) {
    return (
      <p className="py-16 text-center text-sm text-slate-400">Loading…</p>
    );
  }

  if (!destination) {
    return (
      <div className="py-16 text-center">
        <p className="mb-3 text-sm text-slate-500">Destination not found.</p>
        <Link
          to="/destinations"
          className="text-sm text-teal-600 hover:underline"
        >
          Back to explore
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Full-width hero image */}
      <div className="relative h-64 w-full overflow-hidden bg-slate-800 sm:h-80">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-4xl px-4 pb-6 text-white">
          <Link
            to="/destinations"
            className="mb-2 inline-block text-sm text-white/80 hover:underline"
          >
            ← Explore
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold sm:text-3xl">
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
          <p className="text-white/80">{destination.country}</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        {weather?.current && (
          <div className="mb-6 inline-flex items-center gap-3 rounded-2xl bg-white px-5 py-3 shadow-sm">
            <span className="text-2xl">☀️</span>
            <div>
              <p className="text-lg font-semibold text-slate-900">
                {weather.current.temp}°C
              </p>
              <p className="text-xs text-slate-500">
                {weather.current.condition}
              </p>
            </div>
          </div>
        )}

        {destination.description && (
          <p className="mb-8 text-sm leading-relaxed text-slate-600">
            {destination.description}
          </p>
        )}

        <h2 className="mb-3 text-base font-semibold text-slate-900">
          Top attractions
        </h2>
        {attractions.length === 0 ? (
          <p className="mb-8 text-sm text-slate-400">
            No attractions listed yet.
          </p>
        ) : (
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {attractions.map((a) => (
              <div key={a.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="h-28 w-full overflow-hidden bg-slate-100">
                  {a.image && (
                    <img
                      src={a.image}
                      alt={a.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium text-slate-900">{a.name}</p>
                  <p className="text-xs text-slate-500">{a.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {destination.travelGuide && (
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="mb-2 text-base font-semibold text-slate-900">
              📖 Travel guide
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              {destination.travelGuide}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}