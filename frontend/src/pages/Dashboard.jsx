import { CalendarDays, PiggyBank, Plane, Wallet, ArrowRight, PlusCircle, Gem, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getErrorMessage } from '../api/client';
import { dashboardApi } from '../api/tripService';
import LoadingSpinner from '../components/LoadingSpinner';
import { currency, dateLabel } from '../utils';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardApi.get().then(setData).catch((err) => setError(getErrorMessage(err)));
  }, []);

  if (error) return <div className="rounded-2xl bg-red-500/10 p-5 border border-red-500/20"><p className="text-red-400">{error}</p></div>
  if (!data) return <LoadingSpinner label="Loading dashboard" />;

  const stats = [
    { label: 'TOTAL TRIPS', value: data.numberOfTrips, icon: Plane },
    { label: 'UPCOMING TRIPS', value: data.upcomingTrips.length, icon: CalendarDays },
    { label: 'TOTAL EXPENSES', value: currency(data.totalExpenses || 0), icon: Wallet },
    { label: 'REMAINING BUDGET', value: currency(data.budgetRemaining || 0), icon: PiggyBank }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-4xl font-bold text-white">
            Welcome back, <span className="bg-gradient-to-r from-amber-400 to-teal-400 bg-clip-text text-transparent">{user?.name}</span>
          </h1>
          <p className="mt-2 text-white/60">Track your adventures and budget in one place.</p>
        </div>
        <Link to="/trips/new" className="bg-gradient-to-r from-amber-500 to-teal-500 text-[#050A18] font-bold px-6 py-3.5 rounded-2xl shadow-2xl shadow-amber-500/30 hover:scale-105 hover:shadow-amber-500/50 transition-all duration-300 flex items-center gap-2">
          <PlusCircle className="h-5 w-5" /> Plan a New Trip
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-3xl bg-white/5 backdrop-blur-xl border-white/10 p-5 lg:p-7 overflow-hidden hover:border-amber-400/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 group min-w-0">
      
            {/* Top Row */}
            <div className="flex items-center justify-between mb-4 gap-3">
              <span className="text-[10px] lg:text-xs font-bold text-white/50 uppercase tracking-wider truncate">
                {label}
              </span>
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-teal-500 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-110 transition flex-shrink-0">
                <Icon className="h-5 w-5 lg:h-6 lg:w-6 text-[#050A18]" />
              </div>
            </div>

            {/* Value */}
            <p className="font-sans text-2xl lg:text-4xl font-bold text-white truncate tabular-nums">
              {value}
            </p>
          </div>
        ))}
      </div>
      

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming Trips Card */}
        <div className="lg:col-span-2 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Gem className="h-6 w-6 text-amber-400" />
            <h2 className="font-heading text-2xl font-bold text-white">Upcoming Trips</h2>
          </div>
          {data.upcomingTrips.length === 0? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-amber-500/20 to-teal-500/20 flex items-center justify-center mb-6">
                <Plane className="h-12 w-12 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Your next adventure awaits</h3>
              <p className="text-white/50 mb-6">Create your first trip to see it here</p>
              <Link to="/trips/new" className="bg-gradient-to-r from-teal-500 to-amber-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:scale-105 transition-all shadow-lg shadow-teal-500/20">Create First Trip</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {data.upcomingTrips.map((trip) => (
                <Link key={trip.id} to={`/trips/${trip.id}`} className="flex justify-between items-center py-4 hover:bg-white/5 px-4 rounded-xl transition-all group">
                  <div>
                    <p className="font-semibold text-white group-hover:text-amber-400 transition">{trip.title}</p>
                    <p className="text-sm text-white/60">{trip.destination} • {dateLabel(trip.startDate)}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-white/40 group-hover:text-amber-400 group-hover:translate-x-1 transition" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Travel Tip Card */}
        <div className="rounded-3xl bg-gradient-to-br from-amber-500/10 to-teal-500/10 backdrop-blur-xl border border-amber-400/20 p-8">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-teal-400" />
            <span className="bg-teal-500/20 text-teal-400 text-[10px] font-bold px-3 py-1 rounded-full border border-teal-400/30">TRAVEL TIP</span>
          </div>
          <h3 className="font-heading text-lg font-bold text-white mb-3">Keep Budget in Check</h3>
          <p className="text-white/70 text-sm">Log expenses daily to stay 95% accurate with your budget tracking.</p>
          <Link to="/trips" className="mt-6 w-full block text-center bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold py-3 rounded-xl hover:border-amber-400/30 transition">Browse All Trips</Link>
        </div>
      </div>
    </div>
  );
}