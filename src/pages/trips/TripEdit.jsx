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
      <p className="py-16 text-center text-sm text-slate-400">Loading…</p>
    );
  }

  if (!trip) {
    return (
      <div className="py-16 text-center">
        <p className="mb-3 text-sm text-slate-500">Trip not found.</p>
        <Link to="/trips" className="text-sm text-teal-600 hover:underline">
          Back to trips
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
        <div className="mx-auto max-w-lg px-4 py-10">
          <h1 className="text-2xl font-semibold">✏️ Edit trip</h1>
          <p className="mt-1 text-emerald-100">{trip.destination}</p>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 py-8">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
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