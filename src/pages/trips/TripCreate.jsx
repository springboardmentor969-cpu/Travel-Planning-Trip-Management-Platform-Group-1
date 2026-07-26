import { useNavigate } from "react-router-dom";
import tripApi from "../../api/tripApi";
import TripForm from "../../components/trips/TripForm";

export default function TripCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    const trip = await tripApi.createTrip(payload);
    navigate(`/trips/${trip.id}`);
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
        <div className="mx-auto max-w-lg px-4 py-10">
          <h1 className="text-2xl font-semibold">🧭 Plan a new trip</h1>
          <p className="mt-1 text-emerald-100">
            Set the basics — you can add itinerary and budget details after.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 py-8">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <TripForm onSubmit={handleSubmit} submitLabel="Create trip" />
        </div>
      </div>
    </div>
  );
}