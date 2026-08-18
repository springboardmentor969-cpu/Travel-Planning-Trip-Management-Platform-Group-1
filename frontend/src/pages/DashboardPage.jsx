import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Compass,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  PlusCircle,
  ArrowRight,
  Clock,
  Sparkles,
  TrendingUp,
  ChevronRight,
  Bell,
  CheckCircle2
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const DashboardPage = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [tripsRes, analyticsRes, notifsRes] = await Promise.all([
          api.get('/trips'),
          api.get('/analytics/traveler'),
          api.get('/notifications')
        ]);

        if (tripsRes.data?.data) setTrips(tripsRes.data.data);
        if (analyticsRes.data?.data) setAnalytics(analyticsRes.data.data);
        if (notifsRes.data?.data) setNotifications(notifsRes.data.data.slice(0, 4));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading your travel dashboard..." />;
  }

  const upcomingTrip = trips.find(t => t.status === 'PLANNED' || t.status === 'ONGOING') || trips[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Traveler Command Center
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {user?.fullName}! 👋
          </h1>
          <p className="text-emerald-100/80 text-sm max-w-xl">
            You have <span className="font-bold text-white">{analytics?.upcomingTrips || 0} upcoming</span> and{' '}
            <span className="font-bold text-white">{analytics?.completedTrips || 0} completed</span> adventures recorded in TripNest.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 w-full md:w-auto">
          <Link
            to="/trips/new"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-3 rounded-2xl font-bold text-sm shadow-md transition hover:scale-105 duration-200"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Trip</span>
          </Link>
          <Link
            to="/destinations"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-2xl font-semibold text-sm backdrop-blur-md transition"
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Explore</span>
          </Link>
        </div>

        {/* Ambient background blur */}
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{analytics?.totalTrips || 0}</div>
            <div className="text-xs text-slate-500 font-medium">Total Trips</div>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{analytics?.daysTraveled || 0}</div>
            <div className="text-xs text-slate-500 font-medium">Days Traveled</div>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">${analytics?.totalBudgetSpent?.toLocaleString() || '0.00'}</div>
            <div className="text-xs text-slate-500 font-medium">Total Spent</div>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{analytics?.countriesVisited || 0}</div>
            <div className="text-xs text-slate-500 font-medium">Destinations Visited</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Next Journey & Recent Trips */}
        <div className="lg:col-span-8 space-y-8">
          {/* Featured Upcoming Trip Card */}
          {upcomingTrip ? (
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <h2 className="text-lg font-bold text-slate-900">Next Planned Adventure</h2>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase">
                  {upcomingTrip.status}
                </span>
              </div>

              <div className="relative h-64 sm:h-72">
                <img
                  src={
                    upcomingTrip.coverImageUrl ||
                    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=80'
                  }
                  alt={upcomingTrip.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>{upcomingTrip.destination}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {upcomingTrip.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      {upcomingTrip.startDate} to {upcomingTrip.endDate} ({upcomingTrip.daysCount} days)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      Budget: ${upcomingTrip.totalBudget}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-400" />
                      {upcomingTrip.memberCount} Travelers
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-600">
                  <span className="font-bold text-slate-800">Expenses: </span>
                  ${upcomingTrip.totalExpenses || 0} spent of ${upcomingTrip.totalBudget || 0} budget
                </div>
                <Link
                  to={`/trips/${upcomingTrip.id}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition"
                >
                  <span>Open Trip Details &amp; Itinerary</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-sm space-y-4">
              <Compass className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">No trips planned yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Ready to explore? Create your first trip and build a day-by-day itinerary now.
              </p>
              <Link
                to="/trips/new"
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow hover:bg-emerald-700 transition"
              >
                <PlusCircle className="w-4 h-4" /> Create Trip
              </Link>
            </div>
          )}

          {/* All Trips List Overview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Your Recent Trips</h2>
              <Link
                to="/trips"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>View All ({trips.length})</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trips.slice(0, 4).map((trip) => (
                <Link
                  key={trip.id}
                  to={`/trips/${trip.id}`}
                  className="group bg-white p-4 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:shadow-md transition duration-200 flex gap-4 items-center"
                >
                  <img
                    src={
                      trip.coverImageUrl ||
                      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300&auto=format&fit=crop&q=80'
                    }
                    alt={trip.title}
                    className="w-20 h-20 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                        {trip.status}
                      </span>
                      <span className="text-xs font-bold text-emerald-600">
                        ${trip.totalBudget}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 truncate mt-1 group-hover:text-emerald-600 transition">
                      {trip.title}
                    </h4>
                    <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-600" /> {trip.destination}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Quick Actions & Notifications */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Link
                to="/trips/new"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/60 hover:bg-emerald-100/70 border border-emerald-100 text-emerald-900 transition font-semibold text-xs"
              >
                <div className="flex items-center gap-3">
                  <PlusCircle className="w-5 h-5 text-emerald-600" />
                  <span>Create New Itinerary</span>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-600" />
              </Link>

              <Link
                to="/destinations"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-800 transition font-semibold text-xs"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-teal-600" />
                  <span>Discover Destinations</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/analytics"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-800 transition font-semibold text-xs"
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-cyan-600" />
                  <span>Budget &amp; Spend Reports</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Recent Notifications Widget */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-600" />
                <span>Recent Updates</span>
              </h3>
              <Link to="/notifications" className="text-xs font-bold text-emerald-600 hover:underline">
                All
              </Link>
            </div>

            <div className="space-y-3">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <Link
                    key={n.id}
                    to={n.actionUrl || '/notifications'}
                    className={`block p-3 rounded-xl border text-xs transition ${
                      !n.read
                        ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-950 font-medium'
                        : 'bg-slate-50 border-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      {n.title}
                    </div>
                    <p className="text-slate-500 mt-1 line-clamp-2">{n.message}</p>
                  </Link>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-400">
                  No notifications yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
