import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getErrorMessage } from '../api/client';
import { tripApi } from '../api/tripService';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import TripForm from '../components/TripForm';

// helper to safely format date
const formatDate = (d) => {
  if (!d) return '';
  return new Date(d).toISOString().split('T')[0]; // 2026-07-28
};

export default function EditTrip() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    tripApi.get(id)
    .then((data) => {
        // Format dates + remove user_id so it doesn't show in form
        setTrip({
        ...data,
          start_date: formatDate(data.start_date),
          end_date: formatDate(data.end_date),
          status: data.status?.toLowerCase(),
        });
      })
    .catch((err) => setError(getErrorMessage(err)));
  }, [id]);

  const submit = async (payload) => {
    setSaving(true);
    setError('');
    try {
      // Remove fields we don't want to update
      const { user_id, id: tripId, created_at, updated_at,...cleanPayload } = payload;
      cleanPayload.budget = Number(cleanPayload.budget);
      cleanPayload.status = cleanPayload.status.toLowerCase();

      const updated = await tripApi.update(id, cleanPayload);
      navigate(`/trips/${updated.id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (!trip &&!error) return <LoadingSpinner label="Loading trip" />;

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