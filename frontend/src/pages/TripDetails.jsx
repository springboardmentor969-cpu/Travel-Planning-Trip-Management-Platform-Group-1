import { CalendarPlus, Edit, Plus, ReceiptText, Trash2, ArrowLeft, Calendar, MapPin, IndianRupee, ListTodo, Clock } from 'lucide-react'; // 1. Changed DollarSign to IndianRupee + added Clock
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getErrorMessage } from '../api/client';
import { itineraryApi, tripApi } from '../api/tripService';
import Button from '../components/Button';
import Card from '../components/Card';
import FormInput from '../components/FormInput';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { currency, dateLabel } from '../utils';

export default function TripDetails() {
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const load = () => tripApi.details(id).then(setDetails).catch((err) => setError(getErrorMessage(err)));

  useEffect(() => {
    load();
  }, [id]);

  const saveItinerary = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      dayNumber: Number(form.get('dayNumber')),
      title: form.get('title'),
      activityType: form.get('activityType'),
      location: form.get('location'),
      time: form.get('time'), // 2. Saving time
      description: form.get('description')
    };
    if (editing?.id) await itineraryApi.update(id, editing.id, payload);
    else await itineraryApi.create(id, payload);
    setModalOpen(false);
    setEditing(null);
    load();
  };

  const removeItinerary = async (itemId) => {
    if (!confirm('Are you sure you want to remove this day from the itinerary?')) return;
    await itineraryApi.remove(id, itemId);
    load();
  };

  if (error) {
    return (
      <div className="rounded-2xl border-red-150 bg-red-50 p-5 shadow-soft">
        <p className="text-sm font-semibold text-red-600">{error}</p>
      </div>
    );
  }

  if (!details) return <LoadingSpinner label="Loading trip details" />;

  const { trip, itinerary = [], expenses = [], budgetSummary = {} } = details;

  // 3. Sort by day then by time
  const sortedItinerary = [...itinerary].sort((a, b) => {
    if (a.dayNumber!== b.dayNumber) return a.dayNumber - b.dayNumber;
    return (a.time || '').localeCompare(b.time || '');
  });

  return (
    <div className="space-y-8">
      {/* Back Button & Header */}
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-6">
        <Link to="/trips" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-900 transition">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Trips
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
              <MapPin className="h-3.5 w-3.5" /> {trip.destination}
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">{trip.title}</h1>
            <p className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Calendar className="h-3.5 w-3.5 text-slate-350" />
              {dateLabel(trip.startDate)} - {dateLabel(trip.endDate)}
            </p>
          </div>
          <div className="flex gap-2">
            <Link to={`/trips/${id}/expenses`}>
              <Button variant="secondary" className="rounded-xl border-slate-200 text-slate-655 hover:bg-slate-50 font-semibold px-4.5 py-2.5 text-xs">
                <ReceiptText className="h-4 w-4" /> Expenses
              </Button>
            </Link>
            <Link to={`/trips/${id}/edit`}>
              <Button className="bg-indigo-600 hover:bg-indigo-505 text-white font-semibold rounded-xl px-4.5 py-2.5 text-xs">
                <Edit className="h-4 w-4" /> Edit Details
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Widgets - RUPEE ICONS */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border-slate-200/60 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Allocated Budget</span>
            <span className="grid h-7 w-7 place-items-center rounded bg-indigo-50 text-indigo-650"><IndianRupee className="h-4 w-4" /></span>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-950">{currency(budgetSummary.budget || 0)}</p>
        </div>

        <div className="rounded-2xl border-slate-200/60 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Expenses</span>
            <span className="grid h-7 w-7 place-items-center rounded bg-red-50 text-red-655"><ReceiptText className="h-4 w-4" /></span>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-950">{currency(budgetSummary.totalExpenses || 0)}</p>
        </div>

        <div className="rounded-2xl border-slate-200/60 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Remaining Balance</span>
            <span className="grid h-7 w-7 place-items-center rounded bg-emerald-50 text-emerald-650"><IndianRupee className="h-4 w-4" /></span>
          </div>
          <p className={`mt-3 text-2xl font-bold tracking-tight ${(budgetSummary.remainingAmount || 0) < 0? 'text-red-655' : 'text-emerald-700'}`}>
            {currency(budgetSummary.remainingAmount || 0)}
          </p>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Itinerary Column (Left) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded bg-indigo-50 text-indigo-600"><ListTodo className="h-4.5 w-4.5" /></span>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Timeline & Itinerary</h2>
              </div>
              <Button
                onClick={() => { setEditing(null); setModalOpen(true); }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs py-2 px-3.5"
              >
                <Plus className="h-4 w-4" /> Add Activity
              </Button>
            </div>

            {sortedItinerary.length === 0? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-slate-50 border-slate-100 text-slate-400 mb-4">
                  <Calendar className="h-5 w-5" />
                </span>
                <p className="text-sm text-slate-500 font-medium">No activities mapped out yet</p>
              </div>
            ) : (
              <div className="relative pl-6 border-l-2 border-slate-150 space-y-8 ml-3 py-2">
                {sortedItinerary.map((item) => (
                  <div key={item.id} className="relative group">
                    <span className="absolute -left-10 top-0.5 grid h-7 w-7 place-items-center rounded-full bg-white text-[10px] font-bold text-indigo-650 border-2 border-indigo-500">
                      {item.dayNumber}
                    </span>

                    <div className="rounded-xl border-slate-200/60 bg-white p-5 shadow-soft">
                      {/* 4. ADDED TIMING ROW */}
                      <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
                        {item.time && (
                          <span className="flex items-center gap-1 font-mono font-bold text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded-md">
                            <Clock className="h-3 w-3" /> {item.time.slice(0,5)}
                          </span>
                        )}
                        {item.activityType && (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-semibold uppercase tracking-wide text-[10px]">
                            {item.activityType}
                          </span>
                        )}
                        {item.location && (
                          <span className="flex items-center gap-1 text-slate-500">
                            <MapPin className="h-3 w-3"/> {item.location}
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] font-bold text-indigo-650 uppercase tracking-wider">Day {item.dayNumber} Overview</span>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">{item.title}</h3>
                      <p className="text-slate-500 text-sm font-light leading-relaxed mt-2">{item.description}</p>

                      <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition">
                        <button onClick={() => { setEditing(item); setModalOpen(true); }} className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-650"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => removeItinerary(item.id)} className="rounded-lg p-1.5 text-slate-400 hover:text-red-655"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Expenses Snapshot (Right) */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-4">Recent Expenses</h2>
            <div className="divide-y divide-slate-100">
              {expenses.length === 0? (
                <div className="py-8 text-center text-sm text-slate-450">No expenses logged yet.</div>
              ) : (
                expenses.slice(0, 5).map((expense) => (
                  <div key={expense.id} className="flex justify-between items-center py-3 text-sm">
                    <div>
                      <span className="font-semibold text-slate-800">{expense.category}</span>
                      <span className="block text-[10px] text-slate-400">{dateLabel(expense.expenseDate)}</span>
                    </div>
                    <span className="font-semibold text-slate-900">{currency(expense.amount)}</span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Add/Edit Modal with Time field */}
      <Modal open={modalOpen} title={editing? 'Edit Activity' : 'Add Activity'} onClose={() => setModalOpen(false)}>
        <form onSubmit={saveItinerary} className="space-y-4">
          <FormInput label="Day Number" name="dayNumber" type="number" min="1" defaultValue={editing?.dayNumber || 1} required />
          <FormInput label="Time" name="time" type="time" defaultValue={editing?.time || ''} /> {/* Time input added */}
          <FormInput label="Activity Type" name="activityType" as="select" defaultValue={editing?.activityType || 'SIGHTSEEING'} required>
            <option>SIGHTSEEING</option><option>DINING</option><option>ACCOMMODATION</option><option>TRANSPORTATION</option>
          </FormInput>
          <FormInput label="Location" name="location" placeholder="e.g. Munnar, Kerala" defaultValue={editing?.location || ''} />
          <FormInput label="Activity Title" name="title" defaultValue={editing?.title || ''} required />
          <FormInput label="Description" name="description" as="textarea" rows="4" defaultValue={editing?.description || ''} />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-indigo-600 text-white"><CalendarPlus className="h-4 w-4" /> Save Activity</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}