import { useEffect, useState } from "react";
import destinationApi from "../../api/destinationApi";
import DestinationCard from "../../components/destinations/DestinationCard";
import { FEATURED_PLACES } from "../../data/destinationsData";

const CATEGORIES = [
  "All",
  "Beaches & Islands",
  "Mountains & Nature",
  "Cultural & Historical",
  "City Escapes",
  "Luxury & Honeymoon",
];

export default function DestinationList() {
  const [apiDestinations, setApiDestinations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    destinationApi
      .getDestinations()
      .then((data) => setApiDestinations(data || []))
      .catch(() => setApiDestinations([]))
      .finally(() => setIsLoading(false));
  }, []);

  // Combine API destinations with rich local featured places
  const allPlaces = [
    ...FEATURED_PLACES,
    ...apiDestinations.filter(
      (d) => !FEATURED_PLACES.some((f) => f.name.toLowerCase() === d.name?.toLowerCase())
    ),
  ];

  const filteredPlaces = allPlaces.filter((place) => {
    const matchesSearch =
      !search ||
      place.name.toLowerCase().includes(search.toLowerCase()) ||
      place.country?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || place.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Full-bleed Hero Banner */}
      <div className="relative h-80 w-full overflow-hidden sm:h-96">
        <img
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1920&q=80"
          alt="Explore Destinations"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/50 to-indigo-950/40" />

        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-12">
          <span className="inline-block rounded-full bg-teal-500/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-md mb-2 w-max shadow-sm">
            🌍 Travel Inspiration
          </span>
          <h1 className="text-3xl font-extrabold text-white sm:text-5xl tracking-tight drop-shadow-sm">
            Explore Places & Plan Your Trip
          </h1>
          <p className="mt-2 text-sm font-medium text-sky-100 max-w-xl">
            Touch any location to view full details (attractions, guide, weather) or click <strong className="text-white">➕ Plan Trip</strong> to create a trip immediately.
          </p>

          <div className="relative mt-5 max-w-xl">
            <input
              type="text"
              placeholder="Search by city or country (e.g. Tokyo, Paris, Goa, Bali)…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-white/20 bg-white/95 px-4 py-3.5 pl-11 text-sm font-medium text-slate-900 shadow-xl outline-none transition focus:ring-2 focus:ring-teal-500"
            />
            <span className="absolute left-4 top-3.5 text-lg text-slate-400">🔍</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap rounded-2xl border px-4 py-2 text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? "border-teal-600 bg-teal-600 text-white shadow-md"
                  : "border-slate-200 bg-white text-slate-700 hover:border-teal-400 hover:bg-teal-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Places Grid */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {search ? `Results for "${search}"` : `${selectedCategory} Places (${filteredPlaces.length})`}
            </h2>
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
              Touch place for details · Click <strong className="text-teal-600">➕ Plan Trip</strong> to start
            </span>
          </div>

          {isLoading ? (
            <p className="py-16 text-center text-sm font-medium text-slate-400">
              Loading destinations…
            </p>
          ) : filteredPlaces.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white py-16 text-center shadow-xs">
              <span className="mb-3 text-4xl">🏝️</span>
              <p className="text-base font-bold text-slate-800">No destinations found</p>
              <p className="mt-1 text-xs text-slate-500">Try searching for another city or country.</p>
              <button
                onClick={() => { setSearch(""); setSelectedCategory("All"); }}
                className="mt-4 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredPlaces.map((place) => (
                <DestinationCard key={place.id} destination={place} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}