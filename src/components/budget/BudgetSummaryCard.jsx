import { useState } from "react";
import {
  EXPENSE_CATEGORY_LABELS,
  EXPENSE_CATEGORY_COLORS,
  formatCurrency,
} from "../../utils/constants";

export default function BudgetSummaryCard({ budget, report, onUpdateBudget }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(budget?.totalBudget || 0);

  const totalBudget = budget?.totalBudget || 0;
  const totalSpent = report?.totalSpent || budget?.totalSpent || 0;
  const remaining = totalBudget - totalSpent;
  const percentUsed = totalBudget > 0
    ? Math.round((totalSpent / totalBudget) * 100)
    : 0;

  const handleSaveBudget = (e) => {
    e.preventDefault();
    const parsed = parseFloat(newBudget);
    if (isNaN(parsed) || parsed < 0) return;
    onUpdateBudget(parsed);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      {/* Visual Stat Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Budget</p>
          <p className="mt-1 text-lg font-bold text-slate-900">{formatCurrency(totalBudget)}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Spent</p>
          <p className="mt-1 text-lg font-bold text-amber-600">{formatCurrency(totalSpent)}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Remaining</p>
          <p className={`mt-1 text-lg font-bold ${remaining < 0 ? "text-red-600" : "text-emerald-600"}`}>
            {formatCurrency(remaining)}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Used</p>
          <p className={`mt-1 text-lg font-bold ${percentUsed > 100 ? "text-red-600" : percentUsed >= 80 ? "text-amber-600" : "text-teal-600"}`}>
            {percentUsed}%
          </p>
        </div>
      </div>

      {/* Main Card with edit & Category Breakdown */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">
            Trip Budget & Status
          </h3>
          <button
            onClick={() => {
              setNewBudget(totalBudget);
              setIsEditing(!isEditing);
            }}
            className="text-xs font-semibold text-teal-600 hover:underline"
          >
            {isEditing ? "Cancel" : "Edit Budget"}
          </button>
        </div>

        {isEditing && (
          <form onSubmit={handleSaveBudget} className="mb-4 flex items-center gap-2 rounded-xl bg-slate-50 p-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5 text-xs text-slate-400">₹</span>
              <input
                type="number"
                min="0"
                step="100"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                className="w-full rounded-lg border border-slate-300 pl-7 pr-3 py-1.5 text-sm font-semibold text-slate-900 focus:border-teal-500 focus:outline-none"
                placeholder="Enter new budget"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-teal-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-teal-700"
            >
              Save
            </button>
          </form>
        )}

        {/* Warning / Exceeded Alert Banner */}
        {totalBudget > 0 && percentUsed >= 80 && (
          <div className={`mb-4 rounded-xl p-3.5 text-xs font-medium ${
            percentUsed > 100 
              ? "bg-red-50 text-red-700 border border-red-200" 
              : "bg-amber-50 text-amber-800 border border-amber-200"
          }`}>
            {percentUsed > 100 ? (
              <p className="flex items-center gap-1.5 font-semibold">
                <span>🚨</span> Budget Exceeded by {formatCurrency(Math.abs(remaining))}!
              </p>
            ) : (
              <p className="flex items-center gap-1.5 font-semibold">
                <span>⚠️</span> Warning: You have utilized {percentUsed}% of your budget.
              </p>
            )}
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-3 h-3 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              percentUsed > 100 ? "bg-red-500" : percentUsed >= 80 ? "bg-amber-500" : "bg-teal-600"
            }`}
            style={{ width: `${Math.min(100, percentUsed)}%` }}
          />
        </div>

        {/* Category Breakdown */}
        {report?.byCategory && report.byCategory.length > 0 ? (
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Category Spending</p>
            {report.byCategory.map((c) => {
              const catPercent = totalSpent > 0 ? Math.round((c.amount / totalSpent) * 100) : 0;
              return (
                <div key={c.category} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor: EXPENSE_CATEGORY_COLORS[c.category] || "#64748b",
                      }}
                    />
                    <span className="text-slate-700">
                      {EXPENSE_CATEGORY_LABELS[c.category] || c.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{catPercent}%</span>
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(c.amount)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="border-t border-slate-100 pt-3 text-center text-xs text-slate-400">
            No expense categories recorded yet.
          </p>
        )}
      </div>
    </div>
  );
}