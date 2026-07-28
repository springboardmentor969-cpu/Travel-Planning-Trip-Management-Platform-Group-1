import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, BadgeInfo, ChartSpline } from 'lucide-react';
import { getErrorMessage } from '../api/client';
import { budgetApi } from '../api/tripService';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { currency } from '../utils';

export default function Budget() {
  const { id } = useParams();
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    budgetApi.get(id).then(setSummary).catch((err) => setError(getErrorMessage(err)));
  }, [id]);

  if (error) return <Card><p className="text-sm text-red-600">{error}</p></Card>;
  if (!summary) return <LoadingSpinner label="Loading budget" />;

  const spentPercent = summary.budget > 0 ? Math.min(100, (summary.totalExpenses / summary.budget) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-900 p-6 text-white shadow-soft md:p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-cyan-100 backdrop-blur">
          <ChartSpline className="h-3.5 w-3.5" />
          Budget snapshot
        </div>
        <h1 className="mt-4 text-3xl font-bold md:text-5xl">{summary.tripTitle}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">See the financial status of the trip at a glance and jump into expense tracking when needed.</p>
      </div>

      <Card className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Budget</p><p className="mt-1 text-2xl font-bold text-slate-950">{currency(summary.budget)}</p></div>
          <div className="rounded-3xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Expenses</p><p className="mt-1 text-2xl font-bold text-slate-950">{currency(summary.totalExpenses)}</p></div>
          <div className="rounded-3xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Remaining</p><p className="mt-1 text-2xl font-bold text-emerald-700">{currency(summary.remainingAmount)}</p></div>
        </div>

        <div className="rounded-full bg-slate-100 p-1">
          <div className="h-4 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" style={{ width: `${spentPercent}%` }} />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <BadgeInfo className="h-4 w-4 text-blue-600" />
          <span>{spentPercent.toFixed(0)}% of the trip budget has been used.</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to={`/trips/${id}/expenses`}><Button><ArrowRight className="h-4 w-4" />Track expenses</Button></Link>
          <Link to={`/trips/${id}`}><Button variant="secondary">Back to trip</Button></Link>
        </div>
      </Card>
    </div>
  );
}
