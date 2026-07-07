import { CalendarDays, PiggyBank, Plane, WalletCards } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getErrorMessage } from '../api/client';
import { dashboardApi } from '../api/tripService';
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
    { label: 'Trips', value: data.numberOfTrips, icon: Plane, color: 'text-blue-600' },
    { label: 'Upcoming', value: data.upcomingTrips.length, icon: CalendarDays, color: 'text-green-600' },
    { label: 'Expenses', value: currency(data.totalExpenses), icon: WalletCards, color: 'text-slate-700' },
    { label: 'Remaining', value: currency(data.budgetRemaining), icon: PiggyBank, color: 'text-green-600' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">A focused view of trips, budgets, and upcoming plans.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <Icon className={`mb-4 h-5 w-5 ${color}`} />
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-slate-950">{value}</p>
          </Card>
        ))}
      </div>
      <Card>
        <h2 className="text-lg font-semibold text-slate-950">Upcoming trips</h2>
        <div className="mt-4 divide-y divide-slate-100">
          {data.upcomingTrips.length === 0 ? (
            <p className="py-4 text-sm text-slate-500">No upcoming trips yet.</p>
          ) : (
            data.upcomingTrips.map((trip) => (
              <Link key={trip.id} to={`/trips/${trip.id}`} className="flex items-center justify-between py-3 hover:text-blue-700">
                <span>
                  <span className="block font-medium">{trip.title}</span>
                  <span className="text-sm text-slate-500">{trip.destination}</span>
                </span>
                <span className="text-sm text-slate-500">{dateLabel(trip.startDate)}</span>
              </Link>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
