import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Edit trip</h1>
        <p className="mt-1 text-sm text-slate-500">Update core dates, destination, status, and budget.</p>
      </div>
      <Card>
        {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {trip && <TripForm initialValue={trip} onSubmit={submit} saving={saving} />}
      </Card>
    </div>
  );
}
