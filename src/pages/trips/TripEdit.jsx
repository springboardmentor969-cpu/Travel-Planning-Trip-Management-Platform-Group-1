import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import tripApi from "../../api/tripApi";
import TripForm from "../../components/trips/TripForm";

export default function TripEdit() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    tripApi
      .getTripById(tripId)
      .then(setTrip)
      .finally(() => setIsLoading(false));
  }, [tripId]);

  const handleSubmit = async (payload) => {
    await tripApi.updateTrip(tripId, payload);
    navigate(`/trips/${tripId}`);
  };

  if (isLoading) {
    return (
      <p className="py-16 text-center text-sm text-slate-400">Loading trip...</p>
    );
  }

  if (!trip) {
    return (
      <div className="py-16 text-center">
        <p className="mb-3 text-sm text-slate-500">Trip not found.</p>
        <Link to="/trips" className="text-sm font-semibold text-teal-600 hover:underline">
          Back to trips
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Banner with Picture */}
      <div className="relative h-56 w-full overflow-hidden sm:h-64">
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1920&q=80"
          alt="Edit Trip"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-teal-900/30" />
        
        <div className="relative mx-auto flex h-full max-w-xl flex-col justify-between px-4 py-6">
          <Link
            to={`/trips/${tripId}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-teal-200 hover:text-white"
          >
            ← Back to trip details
          </Link>
          <div className="pb-4">
            <h1 className="text-3xl font-bold text-white drop-shadow-sm">✏️ Edit Trip Details</h1>
            <p className="mt-1 text-xs font-medium text-teal-100">
              Updating settings for <span className="font-semibold text-white">{trip.destination}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-xl px-4 py-8">
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-lg">
          <TripForm
            initialValues={{
              destination: trip.destination,
              startDate: trip.startDate?.slice(0, 10),
              endDate: trip.endDate?.slice(0, 10),
              budget: trip.budget,
              travelerCount: trip.travelerCount,
              status: trip.status,
            }}
            onSubmit={handleSubmit}
            submitLabel="Save changes"
          />
        </div>
      </div>
    </div>
  );
}