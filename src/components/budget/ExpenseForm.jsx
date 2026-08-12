import { useState, useEffect } from "react";
import { EXPENSE_CATEGORIES, EXPENSE_CATEGORY_LABELS } from "../../utils/constants";

const emptyForm = {
  category: EXPENSE_CATEGORIES[0],
  amount: "",
  title: "",
  paidBy: "",
  date: new Date().toISOString().slice(0, 10),
};

export default function ExpenseForm({ onSubmit, initialData = null, onCancel = null }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        category: initialData.category || EXPENSE_CATEGORIES[0],
        amount: initialData.amount || "",
        title: initialData.title || initialData.description || "",
        paidBy: initialData.paidBy || "",
        date: initialData.date ? initialData.date : new Date().toISOString().slice(0, 10),
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.amount || Number(form.amount) <= 0) {
      setError("Enter an amount greater than 0.");
      return;
    }
    const finalTitle = form.title.trim() || EXPENSE_CATEGORY_LABELS[form.category] || "Expense";

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...form,
        title: finalTitle,
        amount: Number(form.amount),
      });
      if (!initialData) {
        setForm(emptyForm);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Could not save expense.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-2xl bg-white p-5 shadow-sm border border-slate-100"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">
          {initialData ? "✏️ Edit Expense" : "➕ Add New Expense"}
        </h3>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            Cancel
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500"
          >
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {EXPENSE_CATEGORY_LABELS[cat] || cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Amount (₹)</label>
          <input
            type="number"
            name="amount"
            placeholder="0.00"
            value={form.amount}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Description / Title</label>
          <input
            type="text"
            name="title"
            placeholder="Flight tickets, Hotel stay..."
            value={form.title}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-teal-600 px-5 py-2 text-xs font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
        >
          {isSubmitting ? "Saving…" : initialData ? "Update Expense" : "Add Expense"}
        </button>
      </div>
    </form>
  );
}