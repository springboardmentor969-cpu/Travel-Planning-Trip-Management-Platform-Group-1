import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getErrorMessage } from '../api/client';
import { tripApi } from '../api/tripService';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import Table from '../components/Table';
import { currency, dateLabel } from '../utils';

export default function Trips() {
  const [trips, setTrips] = useState(null);
  const [error, setError] = useState('');

  const load = () => tripApi.list().then(setTrips).catch((err) => setError(getErrorMessage(err)));

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    if (!confirm('Delete this trip?')) return;
    await tripApi.remove(id);
    load();
  };

  const columns = [
    { key: 'title', header: 'Trip' },
    { key: 'destination', header: 'Destination' },
    { key: 'dates', header: 'Dates', render: (trip) => `${dateLabel(trip.startDate)} - ${dateLabel(trip.endDate)}` },
    { key: 'budget', header: 'Budget', render: (trip) => currency(trip.budget) },
    { key: 'status', header: 'Status' },
    {
      key: 'actions',
      header: 'Actions',
      render: (trip) => (
        <div className="flex gap-2">
          <Link to={`/trips/${trip.id}`} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" title="View"><Eye className="h-4 w-4" /></Link>
          <Link to={`/trips/${trip.id}/edit`} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" title="Edit"><Edit className="h-4 w-4" /></Link>
          <button onClick={() => remove(trip.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50" title="Delete"><Trash2 className="h-4 w-4" /></button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">Trips</h1>
          <p className="mt-1 text-sm text-slate-500">Plan, edit, and review every trip.</p>
        </div>
        <Link to="/trips/new"><Button><Plus className="h-4 w-4" />New trip</Button></Link>
      </div>
      {error && <Card><p className="text-sm text-red-600">{error}</p></Card>}
      {!trips ? <LoadingSpinner label="Loading trips" /> : <Table columns={columns} rows={trips} emptyMessage="No trips created yet" />}
    </div>
  );
}
