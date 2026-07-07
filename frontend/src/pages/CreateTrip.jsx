import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../api/client';
import { tripApi, userApi } from '../api/tripService';
import Card from '../components/Card';
import TripForm from '../components/TripForm';
import { defaultUserId } from '../utils';

export default function CreateTrip() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async (payload) => {
    setSaving(true);
    setError('');
    try {
      if (payload.userId === defaultUserId) {
        await userApi.create({ name: 'Demo Traveler', email: 'demo@tripnest.local' }).catch(() => null);
      }
      const trip = await tripApi.create(payload);
      navigate(`/trips/${trip.id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Create trip</h1>
        <p className="mt-1 text-sm text-slate-500">The default user ID is 1 for local MVP testing.</p>
      </div>
      <Card>
        {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <TripForm onSubmit={submit} saving={saving} />
      </Card>
    </div>
  );
}
