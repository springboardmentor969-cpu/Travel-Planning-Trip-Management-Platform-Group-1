import { useRef } from "react";
import {
  EXPENSE_CATEGORY_LABELS,
  EXPENSE_CATEGORY_COLORS,
  formatCurrency,
  formatDate,
} from "../../utils/constants";

export default function ExpenseList({ expenses, onDelete, onUploadReceipt }) {
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

  if (!expenses || expenses.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-300 py-10 text-center text-sm text-slate-400">
        No expenses recorded yet.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelected}
        accept="image/*,application/pdf"
        className="hidden"
      />
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase text-slate-400">
          <tr>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2 text-right">Amount</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id} className="border-t border-slate-100">
              <td className="px-4 py-3 text-slate-500">
                {formatDate(expense.date)}
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs">
                  {EXPENSE_CATEGORY_LABELS[expense.category] || expense.category}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-600">
                {expense.description || "No description"}
              </td>
              <td className="px-4 py-3 text-right font-medium text-slate-800">
                {formatCurrency(expense.amount)}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-3">
                  {expense.receiptUrl ? (
                    <a
                      href={expense.receiptUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-medium text-teal-600 hover:underline"
                    >
                      Receipt
                    </a>
                  ) : (
                    <button
                      onClick={() => triggerUpload(expense.id)}
                      className="text-xs font-medium text-teal-600 hover:underline"
                    >
                      Add receipt
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(expense.id)}
                    className="text-xs font-medium text-slate-400 hover:text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}