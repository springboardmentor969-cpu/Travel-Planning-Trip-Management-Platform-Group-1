import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Plane, Sparkles } from 'lucide-react';
import { getErrorMessage } from '../api/client';
import { tripApi } from '../api/tripService';
import Card from '../components/Card';
import TripForm from '../components/TripForm';

export default function CreateTrip() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const initialValue = {
    destination: searchParams.get('destination') || '',
    title: searchParams.get('title') || ''
  };

  const submit = async (payload) => {
    setSaving(true);
    setError('');
    try {
      const trip = await tripApi.create(payload);
      navigate(`/trips/${trip.id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900 p-6 text-white shadow-soft md:p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-blue-100 backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" />
          New trip builder
        </div>
        <h1 className="mt-4 text-3xl font-bold md:text-5xl">Create a trip with clarity from the first step.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">Set destination, timing, and budget in a single clean form so planning stays focused.</p>
      </div>

      <Card className="max-w-4xl">
        {error && <p className="mb-4 rounded-2xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <TripForm initialValue={initialValue} onSubmit={submit} saving={saving} />
      </Card>
    </div>
  );
}
