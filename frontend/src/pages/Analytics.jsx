import { BarChart3, WalletCards } from 'lucide-react';
import { useEffect, useState } from 'react';
import { analyticsApi } from '../api/tripService';
import { getErrorMessage } from '../api/client';
import { AnalyticsChart, BudgetComparisonChart } from '../components/AnalyticsCharts';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { currency } from '../utils';

export default function Analytics() {
  const [data, setData] = useState(null); const [error, setError] = useState('');
  useEffect(() => { analyticsApi.user().then(setData).catch((err) => setError(getErrorMessage(err))); }, []);
  if (error) return <Card><p className="text-sm text-red-600">{error}</p></Card>;
  if (!data) return <LoadingSpinner label="Loading analytics" />;
  return <div className="space-y-6"><div><p className="text-sm font-semibold uppercase tracking-[.18em] text-blue-600">Reports</p><h1 className="mt-2 text-3xl font-bold text-slate-950">Travel spending analytics</h1><p className="mt-2 text-slate-500">See how your travel budget is distributed across your trips.</p></div><div className="grid gap-4 md:grid-cols-2"><Card><WalletCards className="h-6 w-6 text-blue-600" /><p className="mt-3 text-sm text-slate-500">Total planned budget</p><p className="text-2xl font-bold">{currency(data.totalBudget)}</p></Card><Card><BarChart3 className="h-6 w-6 text-blue-600" /><p className="mt-3 text-sm text-slate-500">Total spend</p><p className="text-2xl font-bold">{currency(data.totalSpent)}</p></Card></div><div className="grid gap-6 xl:grid-cols-2"><AnalyticsChart title="Expenses by category" data={data.expensesByCategory} /><AnalyticsChart title="Monthly spend" data={data.monthlyExpenses} type="line" /></div><BudgetComparisonChart data={data.tripBudgets} /></div>;
}
