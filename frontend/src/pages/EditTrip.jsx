import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom'; // added Link
import { getErrorMessage } from '../api/client';
import { tripApi } from '../api/tripService';
import LoadingSpinner from '../components/LoadingSpinner';
import TripForm from '../components/TripForm';
import { ArrowLeft } from 'lucide-react';

// helper to safely format date
const toInputDate = (d) => d? new Date(d).toISOString().slice(0,10) : '';

export default function EditTrip() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

 useEffect(() => {
  tripApi.get(id).then((data) => {
    setTrip({
     ...data,
      start_date: toInputDate(data.startDate),
      end_date: toInputDate(data.endDate),
      travelers: data.travelers,
      status: data.status?.toLowerCase(),
    });
  }).catch((err) => setError(getErrorMessage(err)));
 }, [id]);

  const submit = async (payload) => {
    setSaving(true);
    setError('');
    try {
      const updatedPayload = {
        id: Number(id),
        title: payload.title,
        destination: payload.destination,
        startDate: payload.start_date,
        endDate: payload.end_date,
        budget: Number(payload.budget),
        travelers: Number(payload.travelers),
        status: payload.status.toUpperCase(),
        userId: 1 // Replace with actual logged in user id
      };

      const updated = await tripApi.update(id, updatedPayload);
      navigate(`/trips/${updated.id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (!trip &&!error) return <LoadingSpinner label="Loading trip" />;

  return (
    <div className="max-w-3xl space-y-6 p-6">
      {/* Header */}
      <div>
        <Link to={`/trips/${id}`} className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-2">
          <ArrowLeft size={16} /> Back to Trip
        </Link>
        <h1 className="text-3xl font-bold text-white">Edit Trip</h1>
        <p className="mt-1 text-sm text-white/60">Update core dates, destination, status, and budget.</p>
      </div>

      {/* Dark Glass Card instead of white Card */}
      <div className="bg-[#0A1A3A]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
        {error && <p className="mb-4 rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-300 border border-red-500/30">{error}</p>}
        {trip && <TripForm initialValue={trip} onSubmit={submit} saving={saving} />}
      </div>
    </div>
  );
}