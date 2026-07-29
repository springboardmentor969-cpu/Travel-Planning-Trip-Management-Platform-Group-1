import { Edit, Plus, Trash2, ArrowLeft } from 'lucide-react';
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
    if (!confirm('Are you sure you want to delete this expense?')) return;
    await expenseApi.remove(id, expenseId);
    load();
  };

  const getCategoryBadge = (category) => {
    const s = String(category || '').toLowerCase();
    let cls = 'bg-white/5 text-white/70 border-white/10'; // default
    if (s.includes('food') || s.includes('dining') || s.includes('restaurant')) {
      cls = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    } else if (s.includes('flight') || s.includes('travel') || s.includes('transport') || s.includes('cab')) {
      cls = 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    } else if (s.includes('hotel') || s.includes('stay') || s.includes('accommodation')) {
      cls = 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    } else if (s.includes('activity') || s.includes('sight') || s.includes('museum') || s.includes('fun')) {
      cls = 'bg-green-500/20 text-green-400 border-green-500/30';
    }
    return (
      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${cls}`}>
        {category}
      </span>
    );
  };

  const columns = [
    { key: 'category', header: 'Category', render: (expense) => getCategoryBadge(expense.category) },
    { key: 'description', header: 'Description', render: (e) => <span className="text-white/80">{e.description}</span> },
    { key: 'expenseDate', header: 'Date', render: (expense) => <span className="text-white/60">{dateLabel(expense.expenseDate)}</span> },
    { key: 'amount', header: 'Amount', render: (expense) => <span className="font-semibold text-white">{currency(expense.amount)}</span> },
    {
      key: 'actions',
      header: 'Actions',
      render: (expense) => (
        <div className="flex gap-1.5">
          <button className="rounded-lg p-1.5 text-white/40 hover:text-amber-400 hover:bg-white/5 transition" onClick={() => { setEditing(expense); setModalOpen(true); }}>
            <Edit className="h-4 w-4" />
          </button>
          <button className="rounded-lg p-1.5 text-white/40 hover:text-red-400 hover:bg-white/5 transition" onClick={() => remove(expense.id)}>
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      {/* Back Button & Header */}
      <div className="flex flex-col gap-4 border-b border-white/10 pb-6">
        <Link to={`/trips/${id}`} className="inline-flex items-center gap-2 text-xs font-semibold text-white/60 hover:text-white transition">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Trip Details
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Expenses</h1>
            <p className="mt-2 text-sm text-white/60 font-light">Track trip spending by category and date logs.</p>
          </div>
          <Button 
            onClick={() => { setEditing(null); setModalOpen(true); }} 
            className="bg-gradient-to-r from-amber-500 to-teal-500 hover:opacity-90 text-[#050A18] font-bold rounded-xl px-4 py-2.5 text-sm shadow-lg shadow-amber-500/30"
          >
            <Plus className="h-4 w-4" /> Add Expense
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border-red-500/30 bg-red-500/10 p-4 backdrop-blur">
          <p className="text-sm font-semibold text-red-400">{error}</p>
        </div>
      )}

      <Card className="bg-[#0A1A3A]/50 backdrop-blur-xl border-white/10 rounded-2xl p-6">
        {!expenses? (
          <LoadingSpinner label="Loading expenses" />
        ) : (
          <Table 
            columns={columns} 
            rows={expenses} 
            emptyMessage="No expenses tracked yet" 
          />
        )}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-4">
          <Link to={`/trips/${id}/budget`} className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition">
            View Budget Summary →
          </Link>
        </div>
      </Card>

      <Modal open={modalOpen} title={editing? 'Edit Expense' : 'Add Expense'} onClose={() => setModalOpen(false)}>
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-white/80 mb-2">Category</label>
            <input name="category" placeholder="e.g. Flight, Restaurant, Hotel..." defaultValue={editing?.category || ''} required 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 [color-scheme:dark]" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white/80 mb-2">Amount</label>
            <input name="amount" type="number" min="0.01" step="0.01" placeholder="0.00" defaultValue={editing?.amount || ''} required 
              className="w-full bg-white/5 border-white/10 rounded-xl px-4 py-3 text-white [color-scheme:dark]" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white/80 mb-2">Date</label>
            <input name="expenseDate" type="date" defaultValue={editing?.expenseDate || new Date().toISOString().slice(0, 10)} required 
              className="w-full bg-white/5 border-white/10 rounded-xl px-4 py-3 text-white [color-scheme:dark]" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white/80 mb-2">Description</label>
            <textarea name="description" rows="3" placeholder="Notes (optional)..." defaultValue={editing?.description || ''} 
              className="w-full bg-white/5 border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40" />
          </div>
          
          <div className="flex justify-end gap-2 pt-2 border-t border-white/10 mt-6">
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-xl px-4 py-2 font-semibold bg-white/5 text-white hover:bg-white/10">
              Cancel
            </button>
            <button type="submit" className="bg-gradient-to-r from-amber-500 to-teal-500 hover:opacity-90 text-[#050A18] font-bold rounded-xl px-4 py-2">
              Save Expense
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}