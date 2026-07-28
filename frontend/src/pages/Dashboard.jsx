import { ArrowRight, CalendarDays, PiggyBank, Plane, Sparkles, WalletCards } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getErrorMessage } from '../api/client';
import { dashboardApi } from '../api/tripService';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { currency, dateLabel } from '../utils';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardApi.get().then(setData).catch((err) => setError(getErrorMessage(err)));
  }, []);

  if (error) return <Card><p className="text-sm text-red-600">{error}</p></Card>;
  if (!data) return <LoadingSpinner label="Loading dashboard" />;

  const stats = [
    { label: 'Trips', value: data.numberOfTrips, icon: Plane, accent: 'from-blue-600 to-indigo-600' },
    { label: 'Upcoming', value: data.upcomingTrips.length, icon: CalendarDays, accent: 'from-emerald-500 to-teal-600' },
    { label: 'Expenses', value: currency(data.totalExpenses), icon: WalletCards, accent: 'from-slate-700 to-slate-900' },
    { label: 'Remaining', value: currency(data.budgetRemaining), icon: PiggyBank, accent: 'from-cyan-500 to-blue-600' }
  ];

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900 p-6 text-white shadow-soft md:p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-blue-100 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Live travel overview
          </div>
          <h1 className="mt-4 text-3xl font-bold md:text-5xl">Your trips, budgets, and plans in one elegant workspace.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
            Track upcoming journeys, monitor spend, and jump directly into active trips without losing context.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/trips/new"><Button><ArrowRight className="h-4 w-4" />Create trip</Button></Link>
            <Link to="/destinations"><Button variant="secondary">Explore destinations</Button></Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, accent }) => (
          <Card key={label} className="relative overflow-hidden">
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`} />
            <div className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br ${accent} p-3 text-white shadow-lg`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-950">{value}</p>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-slate-200/70 px-5 py-4 md:px-6">
          <h2 className="text-lg font-semibold text-slate-950">Upcoming trips</h2>
          <p className="mt-1 text-sm text-slate-500">Open a trip to manage itinerary, budget, and expenses.</p>
        </div>
        <div className="divide-y divide-slate-100">
          {data.upcomingTrips.length === 0 ? (
            <p className="px-5 py-6 text-sm text-slate-500 md:px-6">No upcoming trips yet.</p>
          ) : (
            data.upcomingTrips.map((trip) => (
              <Link key={trip.id} to={`/trips/${trip.id}`} className="flex items-center justify-between px-5 py-4 transition hover:bg-slate-50 md:px-6">
                <span>
                  <span className="block font-semibold text-slate-950">{trip.title}</span>
                  <span className="text-sm text-slate-500">{trip.destination}</span>
                </span>
                <span className="text-sm font-medium text-slate-500">{dateLabel(trip.startDate)}</span>
              </Link>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
