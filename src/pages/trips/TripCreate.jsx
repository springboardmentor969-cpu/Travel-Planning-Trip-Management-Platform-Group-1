import { useNavigate, useSearchParams, Link } from "react-router-dom";
import tripApi from "../../api/tripApi";
import TripForm from "../../components/trips/TripForm";

export default function TripCreate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefilledDestination = searchParams.get("destination") || "";

  const handleSubmit = async (payload) => {
    const trip = await tripApi.createTrip(payload);
    navigate(`/trips/${trip.id}`);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Banner with Picture */}
      <div className="relative h-56 w-full overflow-hidden sm:h-64">
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=80"
          alt="Create Trip"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-teal-900/30" />
        
        <div className="relative mx-auto flex h-full max-w-xl flex-col justify-between px-4 py-6">
          <Link
            to="/trips"
            className="inline-flex items-center gap-1 text-xs font-semibold text-teal-200 hover:text-white"
          >
            ← Back to trips
          </Link>
          <div className="pb-4">
            <h1 className="text-3xl font-bold text-white drop-shadow-sm">🧭 Plan a New Trip</h1>
            <p className="mt-1 text-xs font-medium text-teal-100">
              {prefilledDestination ? (
                <span>Planning your trip to <strong className="text-white font-bold underline underline-offset-2">{prefilledDestination}</strong></span>
              ) : (
                "Set the trip dates, budget, and destination — add activities later."
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-xl px-4 py-8">
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-lg">
          <TripForm
            initialValues={{ destination: prefilledDestination }}
            onSubmit={handleSubmit}
            submitLabel="Create trip"
          />
        </div>
      </div>
    </div>
  );
}