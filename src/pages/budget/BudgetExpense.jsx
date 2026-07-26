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
    const [expenseData, reportData] = await Promise.all([
      budgetApi.getExpenses(tripId),
      budgetApi.getExpenseReport(tripId),
    ]);
    setExpenses(expenseData);
    setReport(reportData);
  };

  const handleAddExpense = async (payload) => {
    await budgetApi.addExpense(tripId, payload);
    await refreshReport();
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm("Delete this expense?")) return;
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
        Loading budget…
      </p>
    );
  }

  return (
    <div>
      <div className="mb-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4">
        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
          💰 Budget & Expenses
        </h2>
        <p className="text-xs text-slate-500">
          Track spending against your planned budget
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <BudgetSummaryCard budget={budget} report={report} />
        </div>
        <div className="space-y-4 lg:col-span-2">
          <ExpenseForm onSubmit={handleAddExpense} />
          <ExpenseList
            expenses={expenses}
            onDelete={handleDeleteExpense}
            onUploadReceipt={handleUploadReceipt}
          />
        </div>
      </div>
    </div>
  );
}