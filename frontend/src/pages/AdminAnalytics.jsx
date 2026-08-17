import { ShieldCheck, Users, Plane, WalletCards } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { analyticsApi } from '../api/tripService';
import { getErrorMessage } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { AnalyticsChart } from '../components/AnalyticsCharts';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { currency } from '../utils';

export default function AdminAnalytics() {
  const { user } = useAuth(); const [data, setData] = useState(null); const [error, setError] = useState('');
  useEffect(() => { if (user?.role === 'ADMIN') analyticsApi.admin().then(setData).catch((err) => setError(getErrorMessage(err))); }, [user]);
  if (user?.role !== 'ADMIN') return <Navigate to="/" replace />;
  if (error) return <Card><p className="text-sm text-red-600">{error}</p></Card>;
  if (!data) return <LoadingSpinner label="Loading admin analytics" />;
  const stats = [[Users, 'Users', data.totalUsers], [Plane, 'Trips', data.totalTrips], [WalletCards, 'Expenses', currency(data.totalExpenses)]];
  return <div className="space-y-6"><div><p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[.18em] text-blue-600"><ShieldCheck className="h-4 w-4" />Administrator only</p><h1 className="mt-2 text-3xl font-bold text-slate-950">Platform analytics</h1></div><div className="grid gap-4 md:grid-cols-3">{stats.map(([Icon, label, value]) => <Card key={label}><Icon className="h-6 w-6 text-blue-600" /><p className="mt-3 text-sm text-slate-500">{label}</p><p className="text-2xl font-bold">{value}</p></Card>)}</div><div className="grid gap-6 xl:grid-cols-2"><AnalyticsChart title="Trips by status" data={data.tripsByStatus} valueLabel="Trips" /><AnalyticsChart title="Expenses by category" data={data.expensesByCategory} /></div><AnalyticsChart title="Monthly platform spend" data={data.monthlyExpenses} type="line" /></div>;
}
