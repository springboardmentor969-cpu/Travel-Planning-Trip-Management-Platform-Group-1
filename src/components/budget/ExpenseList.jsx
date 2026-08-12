import { useState, useRef } from "react";
import {
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_LABELS,
  EXPENSE_CATEGORY_COLORS,
  formatCurrency,
  formatDate,
} from "../../utils/constants";

export default function ExpenseList({ expenses, onEdit, onDelete, onUploadReceipt }) {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef(null);
  const activeExpenseId = useRef(null);

  const triggerUpload = (expenseId) => {
    activeExpenseId.current = expenseId;
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (file && activeExpenseId.current) {
      onUploadReceipt(activeExpenseId.current, file);
    }
    e.target.value = "";
  };

  const filteredExpenses = (expenses || []).filter((exp) => {
    const matchesCategory =
      selectedCategory === "ALL" || exp.category === selectedCategory;
    const titleText = exp.title || exp.description || "";
    const matchesSearch =
      titleText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (exp.paidBy && exp.paidBy.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Category filter and search bar */}
      <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              selectedCategory === "ALL"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All
          </button>
          {EXPENSE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                selectedCategory === cat
                  ? "bg-teal-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {EXPENSE_CATEGORY_LABELS[cat] || cat}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search expenses…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-teal-500 sm:w-48"
        />
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelected}
        accept="image/*,application/pdf"
        className="hidden"
      />

      {/* Expense Table / Cards */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100">
        {filteredExpenses.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-center">
            <span className="mb-2 text-2xl">💸</span>
            <p className="text-sm font-medium text-slate-600">No expenses found</p>
            <p className="text-xs text-slate-400">
              {expenses.length === 0
                ? "Add your first trip expense using the form above."
                : "No expenses match your selected filters."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Title / Description</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExpenses.map((expense) => {
                  const titleText = expense.title || expense.description || "Expense";
                  const catLabel = EXPENSE_CATEGORY_LABELS[expense.category] || expense.category;
                  const catColor = EXPENSE_CATEGORY_COLORS[expense.category] || "#64748b";

                  return (
                    <tr key={expense.id} className="hover:bg-slate-50/60 transition">
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                        {formatDate(expense.date)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
                          style={{
                            backgroundColor: `${catColor}15`,
                            color: catColor,
                          }}
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: catColor }}
                          />
                          {catLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-800 font-medium">
                        {titleText}
                        {expense.paidBy && (
                          <span className="ml-2 text-xs font-normal text-slate-400">
                            (Paid by {expense.paidBy})
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right font-bold text-slate-900">
                        {formatCurrency(expense.amount)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          {expense.receiptUrl ? (
                            <a
                              href={expense.receiptUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-lg bg-teal-50 px-2 py-1 text-xs font-medium text-teal-700 hover:bg-teal-100"
                            >
                              Receipt
                            </a>
                          ) : (
                            <button
                              onClick={() => triggerUpload(expense.id)}
                              className="rounded-lg px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100"
                            >
                              + Receipt
                            </button>
                          )}
                          {onEdit && (
                            <button
                              onClick={() => onEdit(expense)}
                              className="rounded-lg px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                            >
                              Edit
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(expense.id)}
                              className="rounded-lg px-2 py-1 text-xs font-medium text-slate-400 hover:bg-red-50 hover:text-red-600"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}