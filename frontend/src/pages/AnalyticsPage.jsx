import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  PieChart,
  TrendingUp,
  DollarSign,
  Calendar,
  MapPin,
  Compass,
  Download,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

const AnalyticsPage = () => {
  const { success, error } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await api.get('/analytics/traveler');
        if (res.data?.data) {
          setStats(res.data.data);
        }
      } catch (err) {
        error('Failed to load travel analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const handleExportCSV = () => {
    if (!stats) return;

    let csvContent = 'data:text/csv;charset=utf-8,Category,Amount\n';
    if (stats.expensesByCategory) {
      Object.entries(stats.expensesByCategory).forEach(([cat, val]) => {
        csvContent += `${cat},${val}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tripnest_spending_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    success('Spending report downloaded as CSV');
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Computing travel insights &amp; charts..." />;
  }

  if (!stats) return null;

  // 1. Doughnut Chart: Expenses by Category
  const categoryLabels = Object.keys(stats.expensesByCategory || {});
  const categoryValues = Object.values(stats.expensesByCategory || {});
  const categoryData = {
    labels: categoryLabels.map(l => l.charAt(0) + l.slice(1).toLowerCase()),
    datasets: [
      {
        data: categoryValues,
        backgroundColor: [
          '#10b981', // emerald
          '#0ea5e9', // ocean
          '#f59e0b', // amber
          '#8b5cf6', // purple
          '#ec4899', // pink
          '#64748b'  // slate
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  };

  // 2. Bar Chart: Trip Status Distribution
  const statusLabels = Object.keys(stats.tripsByStatus || {});
  const statusValues = Object.values(stats.tripsByStatus || {});
  const statusData = {
    labels: statusLabels,
    datasets: [
      {
        label: 'Number of Trips',
        data: statusValues,
        backgroundColor: '#059669',
        borderRadius: 8
      }
    ]
  };

  // 3. Line Chart: Monthly Spending Trends
  const monthlyLabels = Object.keys(stats.spendingByMonth || {});
  const monthlyValues = Object.values(stats.spendingByMonth || {});
  const monthlyData = {
    labels: monthlyLabels.length > 0 ? monthlyLabels : ['Recent'],
    datasets: [
      {
        label: 'Monthly Spend ($)',
        data: monthlyValues.length > 0 ? monthlyValues : [stats.totalBudgetSpent],
        borderColor: '#0284c7',
        backgroundColor: 'rgba(2, 132, 199, 0.1)',
        fill: true,
        tension: 0.35,
        pointRadius: 5
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <PieChart className="w-8 h-8 text-emerald-600" />
            <span>Travel Analytics &amp; Reports</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Visual breakdown of spending, category allocations, and travel milestones
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow transition"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Export Spending CSV</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-1">
          <span className="text-slate-400 text-[10px] uppercase font-bold">Total Budget Spent</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">${stats.totalBudgetSpent}</div>
          <span className="text-[11px] text-slate-500 block">Across all adventures</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-1">
          <span className="text-slate-400 text-[10px] uppercase font-bold">Planned Budget</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">${stats.totalBudgetPlanned}</div>
          <span className="text-[11px] text-slate-500 block">Total allocated limits</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-1">
          <span className="text-slate-400 text-[10px] uppercase font-bold">Days on the Road</span>
          <div className="text-2xl sm:text-3xl font-black text-teal-600">{stats.daysTraveled} Days</div>
          <span className="text-[11px] text-slate-500 block">Total travel duration</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-1">
          <span className="text-slate-400 text-[10px] uppercase font-bold">Destinations Explored</span>
          <div className="text-2xl sm:text-3xl font-black text-cyan-600">{stats.countriesVisited} Places</div>
          <span className="text-[11px] text-slate-500 block">Unique locations</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Category Breakdown (Doughnut Chart) */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Expenses by Category</h3>
            <p className="text-xs text-slate-500">Distribution across food, hotels, flights, and entertainment</p>
          </div>

          <div className="h-64 flex items-center justify-center">
            {categoryValues.some(v => v > 0) ? (
              <Doughnut
                data={categoryData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
                  }
                }}
              />
            ) : (
              <div className="text-center text-xs text-slate-400">No expense records found yet</div>
            )}
          </div>
        </div>

        {/* Monthly Spending Trend (Line Chart) */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Spending Trends Over Time</h3>
            <p className="text-xs text-slate-500">Monthly travel expenditure records</p>
          </div>

          <div className="h-64 flex items-center justify-center">
            <Line
              data={monthlyData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
              }}
            />
          </div>
        </div>

        {/* Trips Status Distribution (Bar Chart) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Trips by Status</h3>
            <p className="text-xs text-slate-500">Planned, ongoing, completed, and cancelled trips</p>
          </div>

          <div className="h-60">
            <Bar
              data={statusData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
              }}
            />
          </div>
        </div>

        {/* Top Destinations */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Visited Destinations</h3>
          <p className="text-xs text-slate-500">Your personalized travel catalog</p>

          <div className="flex flex-wrap gap-2 pt-2">
            {stats.topDestinations && stats.topDestinations.length > 0 ? (
              stats.topDestinations.map((dest, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-900 text-xs font-bold flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  {dest}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400">No destinations recorded yet</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
