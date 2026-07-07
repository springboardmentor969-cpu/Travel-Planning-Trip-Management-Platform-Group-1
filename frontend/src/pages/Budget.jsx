import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Budget</h1>
        <p className="mt-1 text-sm text-slate-500">{summary.tripTitle}</p>
      </div>
      <Card>
        <div className="grid gap-4 md:grid-cols-3">
          <div><p className="text-sm text-slate-500">Budget</p><p className="text-2xl font-semibold">{currency(summary.budget)}</p></div>
          <div><p className="text-sm text-slate-500">Expenses</p><p className="text-2xl font-semibold">{currency(summary.totalExpenses)}</p></div>
          <div><p className="text-sm text-slate-500">Remaining</p><p className="text-2xl font-semibold text-green-700">{currency(summary.remainingAmount)}</p></div>
        </div>
        <div className="mt-6 h-3 rounded-full bg-slate-100">
          <div className="h-3 rounded-full bg-blue-600" style={{ width: `${spentPercent}%` }} />
        </div>
        <div className="mt-6 flex gap-2">
          <Link to={`/trips/${id}/expenses`}><Button>Track expenses</Button></Link>
          <Link to={`/trips/${id}`}><Button variant="secondary">Back to trip</Button></Link>
        </div>
      </Card>
    </div>
  );
}
