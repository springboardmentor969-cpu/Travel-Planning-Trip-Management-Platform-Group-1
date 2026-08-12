import { Edit, Eye, Filter, Plus, Sparkles, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getErrorMessage } from '../api/client';
import { tripApi } from '../api/tripService';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import Table from '../components/Table';
import { useAuth } from '../contexts/AuthContext';
import { currency, dateLabel } from '../utils';

export default function Trips() {
  const { user } = useAuth();
  const [trips, setTrips] = useState(null);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const load = () => tripApi.list().then(setTrips).catch((err) => setError(getErrorMessage(err)));

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    if (!confirm('Delete this trip?')) return;
    await tripApi.remove(id);
    load();
  };

  const visibleTrips = useMemo(
    () => (trips || []).filter((trip) => statusFilter === 'ALL' || trip.status === statusFilter),
    [trips, statusFilter]
  );

  const statusStyle = {
    PLANNED: 'bg-blue-50 text-blue-700 ring-blue-100',
    ACTIVE: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    COMPLETED: 'bg-violet-50 text-violet-700 ring-violet-100',
    CANCELLED: 'bg-rose-50 text-rose-700 ring-rose-100'
  };

  const columns = [
    { key: 'title', header: 'Trip' },
    { key: 'destination', header: 'Destination' },
    { key: 'dates', header: 'Dates', render: (trip) => `${dateLabel(trip.startDate)} - ${dateLabel(trip.endDate)}` },
    { key: 'budget', header: 'Budget', render: (trip) => currency(trip.budget) },
    { key: 'access', header: 'Access', render: (trip) => (trip.userId === user?.id ? 'Owner' : 'Shared') },
    {
      key: 'status',
      header: 'Status',
      render: (trip) => <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${statusStyle[trip.status] || 'bg-slate-100 text-slate-700 ring-slate-200'}`}>{trip.status.charAt(0) + trip.status.slice(1).toLowerCase()}</span>
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (trip) => (
        <div className="flex gap-2">
          <Link to={`/trips/${trip.id}`} className="rounded-full border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900" title="View"><Eye className="h-4 w-4" /></Link>
          {trip.userId === user?.id && <Link to={`/trips/${trip.id}/edit`} className="rounded-full border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900" title="Edit"><Edit className="h-4 w-4" /></Link>}
          {trip.userId === user?.id && <button onClick={() => remove(trip.id)} className="rounded-full border border-red-100 p-2.5 text-red-600 transition hover:bg-red-50" title="Delete"><Trash2 className="h-4 w-4" /></button>}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-soft backdrop-blur-xl md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
              <Sparkles className="h-3.5 w-3.5" />
              Trip library
            </div>
            <h1 className="mt-4 text-3xl font-bold text-slate-950 md:text-4xl">All trips in one organized view.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">Review destinations, dates, budgets, and actions without digging through screens.</p>
          </div>
          <Link to="/trips/new"><Button><Plus className="h-4 w-4" />New trip</Button></Link>
        </div>
      </div>

      {error && <Card><p className="text-sm text-red-600">{error}</p></Card>}
      {!trips ? <LoadingSpinner label="Loading trips" /> : <>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {['ALL', 'PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELLED'].map((status) => {
            const count = status === 'ALL' ? trips.length : trips.filter((trip) => trip.status === status).length;
            const label = status === 'ALL' ? 'All trips' : status.charAt(0) + status.slice(1).toLowerCase();
            return <button key={status} onClick={() => setStatusFilter(status)} className={`rounded-2xl border p-4 text-left transition ${statusFilter === status ? 'border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-200/70' : 'border-white/70 bg-white/80 text-slate-700 shadow-soft hover:border-blue-200'}`}><p className="text-xs font-semibold uppercase tracking-[.14em] opacity-70">{label}</p><p className="mt-1 text-2xl font-bold">{count}</p></button>;
          })}
        </div>
        <Card className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3 text-sm text-slate-500"><span className="inline-flex items-center gap-2"><Filter className="h-4 w-4" />{statusFilter === 'ALL' ? 'Showing all trips' : `Showing ${statusFilter.toLowerCase()} trips`}</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700 outline-none focus:border-blue-500"><option value="ALL">All statuses</option><option value="PLANNED">Planned</option><option value="ACTIVE">Active</option><option value="COMPLETED">Completed</option><option value="CANCELLED">Cancelled</option></select></div>
          <Table columns={columns} rows={visibleTrips} emptyMessage={`No ${statusFilter === 'ALL' ? '' : statusFilter.toLowerCase()} trips found`} />
        </Card>
      </>}
    </div>
  );
}
