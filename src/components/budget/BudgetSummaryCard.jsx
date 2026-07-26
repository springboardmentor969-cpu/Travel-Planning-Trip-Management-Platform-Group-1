import {
  EXPENSE_CATEGORY_LABELS,
  EXPENSE_CATEGORY_COLORS,
  formatCurrency,
} from "../../utils/constants";

export default function BudgetSummaryCard({ budget, report }) {
  const totalBudget = budget?.totalBudget || 0;
  const totalSpent = report?.totalSpent || 0;
  const remaining = totalBudget - totalSpent;
  const percentUsed = totalBudget
    ? Math.min(100, Math.round((totalSpent / totalBudget) * 100))
    : 0;

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-base font-semibold text-slate-900">
          Budget overview
        </h2>
        <span
          className={`text-sm font-medium ${
            remaining < 0 ? "text-red-600" : "text-slate-500"
          }`}
        >
          {remaining < 0 ? "Over budget" : `${formatCurrency(remaining)} left`}
        </span>
      </div>

      <div className="mb-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${
            percentUsed >= 100 ? "bg-red-500" : "bg-teal-600"
          }`}
          style={{ width: `${percentUsed}%` }}
        />
      </div>

      <div className="mb-4 flex justify-between text-sm">
        <span className="text-slate-500">
          Spent {formatCurrency(totalSpent)}
        </span>
        <span className="text-slate-500">
          Budget {formatCurrency(totalBudget)}
        </span>
      </div>

      {report?.byCategory && report.byCategory.length > 0 && (
        <div className="space-y-2 border-t border-slate-100 pt-4">
          {report.byCategory.map((c) => (
            <div key={c.category} className="flex items-center gap-2 text-sm">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: EXPENSE_CATEGORY_COLORS[c.category],
                }}
              />
              <span className="flex-1 text-slate-600">
                {EXPENSE_CATEGORY_LABELS[c.category] || c.category}
              </span>
              <span className="font-medium text-slate-800">
                {formatCurrency(c.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}