import { useEffect, useState } from "react";
import destinationApi from "../../api/destinationApi";
import DestinationCard from "../../components/destinations/DestinationCard";

export default function DestinationList() {
  const [destinations, setDestinations] = useState([]);
  const [popular, setPopular] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadDestinations = async () => {
    setIsLoading(true);
    try {
      const data = await destinationApi.getDestinations({
        search: search || undefined,
      });
      setDestinations(data);
    } catch (err) {
      setDestinations([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    destinationApi
      .getPopularDestinations()
      .then(setPopular)
      .catch(() => setPopular([]));
  }, []);

  useEffect(() => {
    const timeout = setTimeout(loadDestinations, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="bg-slate-50">
      <div className="relative h-72 w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-indigo-900/40 to-sky-900/40" />

        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-10">
          <h1 className="text-3xl font-semibold text-white">Where to next?</h1>
          <p className="mt-1 text-sky-100">
            Browse destinations, attractions, and travel guides.
          </p>
          <input
            type="text"
            placeholder="Search destinations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-4 w-full max-w-md rounded-lg border-0 px-4 py-3 text-sm text-slate-900 shadow-lg outline-none focus:ring-2 focus:ring-white"
          />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {!search && popular.length > 0 && (
          <div className="mb-10">
            <h2 className="mb-3 text-lg font-semibold text-slate-900">
              🔥 Popular right now
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {popular.map((d) => (
                <DestinationCard key={d.id} destination={d} />
              ))}
            </div>
          </div>
        )}

        <h2 className="mb-3 text-lg font-semibold text-slate-900">
          {search ? `Results for "${search}"` : "All destinations"}
        </h2>

        {isLoading && (
          <p className="py-10 text-center text-sm text-slate-400">
            Loading destinations…
          </p>
        )}
        {!isLoading && destinations.length === 0 && (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 py-14 text-center">
            <span className="mb-2 text-3xl">🧭</span>
            <p className="text-sm text-slate-500">No destinations found.</p>
          </div>
        )}
        {!isLoading && destinations.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {destinations.map((d) => (
              <DestinationCard key={d.id} destination={d} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}