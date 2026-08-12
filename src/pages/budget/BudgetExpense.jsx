import { useEffect, useState } from "react";
import budgetApi from "../../api/budgetApi";
import BudgetSummaryCard from "../../components/budget/BudgetSummaryCard";
import ExpenseForm from "../../components/budget/ExpenseForm";
import ExpenseList from "../../components/budget/ExpenseList";

export default function BudgetExpense({ tripId }) {
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState(null);

  const loadAll = async () => {
    setIsLoading(true);
    try {
      const [budgetData, expenseData, reportData] = await Promise.all([
        budgetApi.getBudget(tripId),
        budgetApi.getExpenses(tripId),
        budgetApi.getExpenseReport(tripId),
      ]);
      setBudget(budgetData);
      setExpenses(expenseData);
      setReport(reportData);
    } catch (err) {
      // leave defaults
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  const refreshReport = async () => {
    const [budgetData, expenseData, reportData] = await Promise.all([
      budgetApi.getBudget(tripId),
      budgetApi.getExpenses(tripId),
      budgetApi.getExpenseReport(tripId),
    ]);
    setBudget(budgetData);
    setExpenses(expenseData);
    setReport(reportData);
  };

  const handleUpdateBudget = async (newBudget) => {
    await budgetApi.updateBudget(tripId, newBudget);
    await refreshReport();
  };

  const handleAddExpense = async (payload) => {
    if (editingExpense) {
      await budgetApi.updateExpense(tripId, editingExpense.id, payload);
      setEditingExpense(null);
    } else {
      await budgetApi.addExpense(tripId, payload);
    }
    await refreshReport();
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    await budgetApi.deleteExpense(tripId, expenseId);
    await refreshReport();
  };

  const handleUploadReceipt = async (expenseId, file) => {
    await budgetApi.uploadReceipt(tripId, expenseId, file);
    await refreshReport();
  };

  if (isLoading) {
    return (
      <p className="py-10 text-center text-sm text-slate-400">
        Loading budget & expense management…
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 p-5 border border-amber-200/50">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
          💰 Budget & Expense Dashboard
        </h2>
        <p className="text-xs text-slate-500">
          Track expenses, set spending limits, and optimize travel costs
        </p>
      </div>

      <BudgetSummaryCard
        budget={budget}
        report={report}
        onUpdateBudget={handleUpdateBudget}
      />

      <div className="space-y-5">
        <ExpenseForm
          onSubmit={handleAddExpense}
          initialData={editingExpense}
          onCancel={() => setEditingExpense(null)}
        />

        <div>
          <h3 className="mb-3 text-sm font-bold text-slate-900">
            Recorded Expenses ({expenses.length})
          </h3>
          <ExpenseList
            expenses={expenses}
            onEdit={(exp) => setEditingExpense(exp)}
            onDelete={handleDeleteExpense}
            onUploadReceipt={handleUploadReceipt}
          />
        </div>
      </div>
    </div>
  );
}