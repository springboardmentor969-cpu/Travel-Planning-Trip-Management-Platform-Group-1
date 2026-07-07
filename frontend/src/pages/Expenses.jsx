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
          <button className="rounded-lg p-2 hover:bg-slate-100" onClick={() => { setEditing(expense); setModalOpen(true); }}><Edit className="h-4 w-4" /></button>
          <button className="rounded-lg p-2 text-red-600 hover:bg-red-50" onClick={() => remove(expense.id)}><Trash2 className="h-4 w-4" /></button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">Expenses</h1>
          <p className="mt-1 text-sm text-slate-500">Track trip spending by category and date.</p>
        </div>
        <Button onClick={() => { setEditing(null); setModalOpen(true); }}><Plus className="h-4 w-4" />Add expense</Button>
      </div>
      {error && <Card><p className="text-sm text-red-600">{error}</p></Card>}
      {!expenses ? <LoadingSpinner label="Loading expenses" /> : <Table columns={columns} rows={expenses} emptyMessage="No expenses yet" />}
      <Link to={`/trips/${id}/budget`} className="inline-block text-sm font-medium text-blue-700">View budget summary</Link>
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
