import { ArrowRight, CalendarDays, PiggyBank, Plane, Sparkles, WalletCards } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getErrorMessage } from '../api/client';
import { dashboardApi, invitationsApi } from '../api/tripService';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { currency, dateLabel } from '../utils';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [invitations, setInvitations] = useState(null);
  const [error, setError] = useState('');
  const [inviteError, setInviteError] = useState('');

  const loadDashboard = async () => {
    const [dashboard, inviteList] = await Promise.all([
      dashboardApi.get(),
      invitationsApi.listMine()
    ]);
    setData(dashboard);
    setInvitations(inviteList);
  };

  useEffect(() => {
    let active = true;

    const refresh = async () => {
      try {
        const [dashboard, inviteList] = await Promise.all([
          dashboardApi.get(),
          invitationsApi.listMine()
        ]);
        if (!active) return;
        setData(dashboard);
        setInvitations(inviteList);
      } catch (err) {
        if (!active) return;
        setError(getErrorMessage(err));
      }
    };

    refresh();
    const intervalId = window.setInterval(refresh, 10000);
    window.addEventListener('focus', refresh);

    return () => {
      active = false;
      window.clearInterval(intervalId);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  const acceptInvite = async (inviteId) => {
    await invitationsApi.accept(inviteId);
    await loadDashboard();
  };

  const rejectInvite = async (inviteId) => {
    await invitationsApi.reject(inviteId);
    await loadDashboard();
  };

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

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Trip invitations</p>
            <h2 className="mt-2 text-xl font-bold text-slate-950">Pending invites to join other trips</h2>
            <p className="mt-1 text-sm text-slate-500">Open an invite to decide whether you want to join the trip workspace.</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {invitations?.length || 0} pending
          </span>
        </div>

        {inviteError && <p className="mt-4 text-sm text-red-600">{inviteError}</p>}
        {!invitations ? (
          <div className="mt-4 text-sm text-slate-500">Loading invitations...</div>
        ) : invitations.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No pending invitations.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {invitations.map((invite) => (
              <div key={invite.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-950">{invite.tripTitle}</p>
                    <p className="text-sm text-slate-500">{invite.tripDestination}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">Invited by {invite.invitedByName}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => acceptInvite(invite.id)}>Accept</Button>
                    <Button variant="secondary" onClick={() => rejectInvite(invite.id)}>Reject</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

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
