import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { getErrorMessage } from '../api/client';
import { tripApi } from '../api/tripService';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import TripForm from '../components/TripForm';

export default function EditTrip() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    tripApi.get(id).then(setTrip).catch((err) => setError(getErrorMessage(err)));
  }, [id]);

  const submit = async (payload) => {
    setSaving(true);
    setError('');
    try {
      const updated = await tripApi.update(id, payload);
      navigate(`/trips/${updated.id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (!trip && !error) return <LoadingSpinner label="Loading trip" />;

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900 p-6 text-white shadow-soft md:p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-blue-100 backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" />
          Update trip
        </div>
        <h1 className="mt-4 text-3xl font-bold md:text-5xl">Refine destination, dates, and budget.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">Keep trip details precise and aligned with the itinerary and expense flow.</p>
      </div>

      <Card className="max-w-4xl">
        {error && <p className="mb-4 rounded-2xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {trip && <TripForm initialValue={trip} onSubmit={submit} saving={saving} />}
      </Card>
    </div>
  );
}
