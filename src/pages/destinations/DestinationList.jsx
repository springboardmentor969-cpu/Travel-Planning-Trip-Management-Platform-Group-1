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
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-semibold text-slate-900">
        Explore destinations
      </h1>
      <p className="mb-6 text-sm text-slate-500">
        Browse places, attractions, and travel guides.
      </p>

      <input
        type="text"
        placeholder="Search destinations…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-8 w-full max-w-md rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500"
      />

      {!search && popular.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-3 text-base font-semibold text-slate-900">
            Popular right now
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((d) => (
              <DestinationCard key={d.id} destination={d} />
            ))}
          </div>
        </div>
      )}

      <h2 className="mb-3 text-base font-semibold text-slate-900">
        {search ? `Results for "${search}"` : "All destinations"}
      </h2>

      {isLoading && (
        <p className="py-10 text-center text-sm text-slate-400">
          Loading destinations…
        </p>
      )}
      {!isLoading && destinations.length === 0 && (
        <p className="py-10 text-center text-sm text-slate-400">
          No destinations found.
        </p>
      )}
      {!isLoading && destinations.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((d) => (
            <DestinationCard key={d.id} destination={d} />
          ))}
        </div>
      )}
    </div>
  );
}