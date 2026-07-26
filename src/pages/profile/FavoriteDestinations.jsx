import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import DestinationCard from "../../components/destinations/DestinationCard";

export default function FavoriteDestinations() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFavorites = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosClient.get(
        "/users/me/favorite-destinations"
      );
      setFavorites(data);
    } catch (err) {
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleRemove = async (destinationId) => {
    await axiosClient.delete(
      `/users/me/favorite-destinations/${destinationId}`
    );
    setFavorites((prev) => prev.filter((d) => d.id !== destinationId));
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-amber-500 to-pink-600 text-white">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <Link to="/profile" className="text-sm text-amber-100 hover:underline">
            ← Profile
          </Link>
          <h1 className="mt-2 text-2xl font-semibold">⭐ Favorite destinations</h1>
          <p className="mt-1 text-amber-100">
            Places you've saved for future trips.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        {isLoading && (
          <p className="py-10 text-center text-sm text-slate-400">Loading…</p>
        )}

        {!isLoading && favorites.length === 0 && (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 py-14 text-center">
            <span className="mb-2 text-3xl">🌍</span>
            <p className="mb-3 text-sm text-slate-500">
              You haven't saved any destinations yet.
            </p>
            <Link
              to="/destinations"
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
            >
              Explore destinations
            </Link>
          </div>
        )}

        {!isLoading && favorites.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((d) => (
              <div key={d.id} className="relative">
                <DestinationCard destination={d} />
                <button
                  onClick={() => handleRemove(d.id)}
                  className="absolute right-3 top-3 rounded-full bg-white/90 p-1.5 text-red-500 shadow"
                  title="Remove from favorites"
                >
                  ★
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}