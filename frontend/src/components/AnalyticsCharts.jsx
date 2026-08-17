import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Card from './Card';
import { currency } from '../utils';

function EmptyChart() {
  return <div className="flex h-64 items-center justify-center text-sm text-slate-500">No data available yet.</div>;
}

export function AnalyticsChart({ title, data, type = 'bar', valueLabel = 'Amount' }) {
  const Chart = type === 'line' ? LineChart : BarChart;
  return (
    <Card>
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      {data.length === 0 ? <EmptyChart /> : <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <Chart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => [currency(value), valueLabel]} />
            {type === 'line' ? <Line type="monotone" dataKey="value" name={valueLabel} stroke="#2563eb" strokeWidth={3} /> : <Bar dataKey="value" name={valueLabel} fill="#2563eb" radius={[6, 6, 0, 0]} />}
          </Chart>
        </ResponsiveContainer>
      </div>}
    </Card>
  );
}

export function BudgetComparisonChart({ data }) {
  const chartData = data.map((trip) => ({ label: trip.tripTitle, budget: trip.budget, spent: trip.spent }));
  return <Card><h2 className="text-lg font-semibold text-slate-950">Planned budget versus spend</h2>{chartData.length === 0 ? <EmptyChart /> : <div className="mt-4 h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="label" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip formatter={(value) => currency(value)} /><Legend /><Bar dataKey="budget" name="Budget" fill="#94a3b8" radius={[6, 6, 0, 0]} /><Bar dataKey="spent" name="Spent" fill="#2563eb" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>}</Card>;
}
