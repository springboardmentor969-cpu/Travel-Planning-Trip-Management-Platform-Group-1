import { useState } from "react";
import { EXPENSE_CATEGORIES, EXPENSE_CATEGORY_LABELS } from "../../utils/constants";

const emptyForm = {
  category: EXPENSE_CATEGORIES[0],
  amount: "",
  description: "",
  date: new Date().toISOString().slice(0, 10),
};

export default function ExpenseForm({ onSubmit }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    try {
      await onSubmit({ ...form, amount: Number(form.amount) });
      setForm(emptyForm);
    } catch (err) {
      setError(err.response?.data?.message || "Could not add this expense.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-3 rounded-2xl bg-white p-5 shadow-sm sm:grid-cols-5"
    >
      {error && (
        <div className="sm:col-span-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500"
      >
        {EXPENSE_CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {EXPENSE_CATEGORY_LABELS[cat]}
          </option>
        ))}
      </select>

      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500"
      />

      <input
        type="text"
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 sm:col-span-2"
      />

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="sm:col-span-5 rounded-lg bg-teal-600 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-60"
      >
        {isSubmitting ? "Adding…" : "Add expense"}
      </button>
    </form>
  );
}