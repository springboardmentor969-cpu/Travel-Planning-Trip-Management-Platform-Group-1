import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getErrorMessage } from '../api/client';
import { budgetApi } from '../api/tripService';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { currency } from '../utils';
import { ArrowLeft, PiggyBank, ReceiptText, Wallet } from 'lucide-react';

export default function Budget() {
  const { id } = useParams();
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    budgetApi.get(id).then(setSummary).catch((err) => setError(getErrorMessage(err)));
  }, [id]);

  if (error) {
    return (
      <div className="rounded-2xl border-red-500/30 bg-red-500/10 p-5 backdrop-blur">
        <p className="text-sm font-semibold text-red-400">{error}</p>
      </div>
    );
  }
  
  if (!summary) return <LoadingSpinner label="Loading budget summary" />;

  const spentPercent = summary.budget > 0? Math.min(100, (summary.totalExpenses / summary.budget) * 100) : 0;

  // Dynamically determine progress bar color
  let progressColor = 'bg-green-500';
  if (spentPercent > 90) {
    progressColor = 'bg-red-500';
  } else if (spentPercent > 60) {
    progressColor = 'bg-amber-500';
  }

  return (
    <div className="max-w-3xl space-y-8">
      {/* Back Button & Header */}
      <div className="flex flex-col gap-4 border-b border-white/10 pb-6">
        <Link to={`/trips/${id}`} className="inline-flex items-center gap-2 text-xs font-semibold text-white/60 hover:text-white transition">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Trip Details
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Budget Analysis</h1>
          <p className="mt-2 text-sm text-white/60 font-light">{summary.tripTitle}</p>
        </div>
      </div>

      <Card className="bg-[#0A1A3A]/50 backdrop-blur-xl border-white/10 rounded-2xl p-6 md:p-8 space-y-8">
        {/* Core numbers Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-1">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-white/50 uppercase tracking-wider">
              <Wallet className="h-4 w-4 text-white/40" /> Target Budget
            </span>
            <p className="text-2xl font-bold tracking-tight text-white">{currency(summary.budget)}</p>
          </div>
          
          <div className="space-y-1">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-white/50 uppercase tracking-wider">
              <ReceiptText className="h-4 w-4 text-white/40" /> Spent So Far
            </span>
            <p className="text-2xl font-bold tracking-tight text-white">{currency(summary.totalExpenses)}</p>
          </div>

          <div className="space-y-1">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-white/50 uppercase tracking-wider">
              <PiggyBank className="h-4 w-4 text-white/40" /> Remaining
            </span>
            <p className={`text-2xl font-bold tracking-tight ${summary.remainingAmount < 0? 'text-red-400' : 'text-green-400'}`}>
              {currency(summary.remainingAmount)}
            </p>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <div className="flex justify-between items-center text-xs font-bold text-white/60 uppercase tracking-wider">
            <span>Spending Utilization</span>
            <span className={spentPercent > 90? 'text-red-400' : spentPercent > 60? 'text-amber-400' : 'text-green-400'}>
              {spentPercent.toFixed(0)}% Used
            </span>
          </div>
          
          <div className="h-3.5 w-full rounded-full bg-white/5 overflow-hidden border-white/10">
            <div className={`h-full rounded-full transition-all duration-500 ${progressColor}`} style={{ width: `${spentPercent}%` }} />
          </div>

          {summary.remainingAmount < 0 && (
            <p className="text-xs text-red-400 font-semibold mt-2">
              ⚠️ Warning: You have exceeded your target budget by {currency(Math.abs(summary.remainingAmount))}.
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-3 pt-6 border-t border-white/10">
          <Link to={`/trips/${id}/expenses`}>
            <Button className="bg-gradient-to-r from-amber-500 to-teal-500 hover:opacity-90 text-[#050A18] font-bold rounded-xl px-5 py-2.5 text-sm shadow-lg shadow-amber-500/30">
              Track Expenses
            </Button>
          </Link>
          <Link to={`/trips/${id}`}>
            <Button variant="secondary" className="rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 px-5 py-2.5 text-sm font-semibold">
              Back to Trip
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
