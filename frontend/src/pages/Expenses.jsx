import { Edit, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getErrorMessage } from '../api/client';
import { expenseApi } from '../api/tripService';
import Button from '../components/Button';
import Card from '../components/Card';
import FormInput from '../components/FormInput';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import Table from '../components/Table';
import { currency, dateLabel } from '../utils';

export default function Expenses() {
  const { id } = useParams();
  const [expenses, setExpenses] = useState(null);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = () => expenseApi.list(id).then(setExpenses).catch((err) => setError(getErrorMessage(err)));

  useEffect(() => {
    load();
  }, [id]);

  const save = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      category: form.get('category'),
      amount: Number(form.get('amount')),
      description: form.get('description'),
      expenseDate: form.get('expenseDate')
    };
    if (editing?.id) await expenseApi.update(id, editing.id, payload);
    else await expenseApi.create(id, payload);
    setEditing(null);
    setModalOpen(false);
    load();
  };

  const remove = async (expenseId) => {
    await expenseApi.remove(id, expenseId);
    load();
  };

  const columns = [
    { key: 'category', header: 'Category' },
    { key: 'description', header: 'Description' },
    { key: 'expenseDate', header: 'Date', render: (expense) => dateLabel(expense.expenseDate) },
    { key: 'amount', header: 'Amount', render: (expense) => currency(expense.amount) },
    {
      key: 'actions',
      header: 'Actions',
      render: (expense) => (
        <div className="flex gap-2">
          <button className="rounded-full border border-slate-200 p-2.5 transition hover:bg-slate-50" onClick={() => { setEditing(expense); setModalOpen(true); }}><Edit className="h-4 w-4" /></button>
          <button className="rounded-full border border-red-100 p-2.5 text-red-600 transition hover:bg-red-50" onClick={() => remove(expense.id)}><Trash2 className="h-4 w-4" /></button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900 p-6 text-white shadow-soft md:p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-indigo-100 backdrop-blur">
          Expense tracker
        </div>
        <h1 className="mt-4 text-3xl font-bold md:text-5xl">Track trip spending with confidence.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">Record travel costs, review categories, and keep the budget picture accurate.</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-blue-600">Expense log</p>
          <p className="mt-1 text-sm text-slate-500">A running list of trip spend entries by date and category.</p>
        </div>
        <Button onClick={() => { setEditing(null); setModalOpen(true); }}><Plus className="h-4 w-4" />Add expense</Button>
      </div>

      {error && <Card><p className="text-sm text-red-600">{error}</p></Card>}
      {!expenses ? <LoadingSpinner label="Loading expenses" /> : <Card className="overflow-hidden p-0"><Table columns={columns} rows={expenses} emptyMessage="No expenses yet" /></Card>}
      <Link to={`/trips/${id}/budget`} className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800">View budget summary</Link>
      <Modal open={modalOpen} title={editing ? 'Edit expense' : 'Add expense'} onClose={() => setModalOpen(false)}>
        <form onSubmit={save} className="space-y-4">
          <FormInput label="Category" name="category" defaultValue={editing?.category || ''} required />
          <FormInput label="Amount" name="amount" type="number" min="0.01" step="0.01" defaultValue={editing?.amount || ''} required />
          <FormInput label="Date" name="expenseDate" type="date" defaultValue={editing?.expenseDate || new Date().toISOString().slice(0, 10)} required />
          <FormInput label="Description" name="description" as="textarea" rows="3" defaultValue={editing?.description || ''} />
          <Button type="submit">Save expense</Button>
        </form>
      </Modal>
    </div>
  );
}
