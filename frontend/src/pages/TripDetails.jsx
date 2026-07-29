import { CalendarPlus, Edit, Plus, ReceiptText, Trash2, ArrowLeft, Calendar, MapPin, IndianRupee, ListTodo, Clock } from 'lucide-react';
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
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // cleanup when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    }
  }, [modalOpen]);

  const saveItinerary = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      dayNumber: Number(form.get('dayNumber')),
      title: form.get('title'),
      activityType: form.get('activityType'),
      location: form.get('location'),
      time: form.get('time'),
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
      <div className="rounded-2xl border-red-400 bg-red-950/30 p-5">
        <p className="text-sm font-semibold text-red-400">{error}</p>
      </div>
    );
  }

  if (!details) return <LoadingSpinner label="Loading trip details" />;

  const { trip, itinerary = [], expenses = [], budgetSummary = {} } = details;

  const sortedItinerary = [...itinerary].sort((a, b) => {
    if (a.dayNumber !== b.dayNumber) return a.dayNumber - b.dayNumber;
    return (a.time || '').localeCompare(b.time || '');
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-white/10 pb-6">
        <Link to="/trips" className="inline-flex items-center gap-2 text-xs font-semibold text-white/60 hover:text-white transition">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Trips
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="flex items-center gap-1 text-[11px] font-semibold bg-logo-gradient bg-clip-text text-transparent uppercase tracking-wider">
              <MapPin className="h-3.5 w-3.5 text-logo-yellow" /> {trip.destination}
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">{trip.title}</h1>
            <p className="flex items-center gap-1.5 text-xs text-white/60 font-medium">
              <Calendar className="h-3.5 w-3.5" />
              {dateLabel(trip.startDate)} - {dateLabel(trip.endDate)}
            </p>
          </div>
          <div className="flex gap-2">
            <Link to={`/trips/${id}/expenses`}>
              <Button variant="secondary" className="rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 font-semibold px-4 py-2.5 text-xs">
                <ReceiptText className="h-4 w-4" /> Expenses
              </Button>
            </Link>
            <Link to={`/trips/${id}/edit`}>
              <Button className="bg-active-gradient hover:opacity-90 text-brand font-bold rounded-xl px-4 py-2.5 text-xs shadow-active-glow">
                <Edit className="h-4 w-4" /> Edit Details
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Widgets - Dark Glass + Cream Numbers */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-brand-light/80 backdrop-blur border-white/10 p-5">
          <div className="flex items-center justify-between text-white/60">
            <span className="text-xs font-semibold uppercase tracking-wider">Allocated Budget</span>
            <span className="grid h-7 w-7 place-items-center rounded bg-active-gradient text-brand"><IndianRupee className="h-4 w-4" /></span>
          </div>
          <p className="mt-3 text-2xl font-bold text-white">{currency(budgetSummary.budget || 0)}</p>
        </Card>

        <Card className="bg-brand-light/80 backdrop-blur border-white/10 p-5">
          <div className="flex items-center justify-between text-white/60">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Expenses</span>
            <span className="grid h-7 w-7 place-items-center rounded bg-red-500/20 text-red-400"><ReceiptText className="h-4 w-4" /></span>
          </div>
          <p className="mt-3 text-2xl font-bold text-white">{currency(budgetSummary.totalExpenses || 0)}</p>
        </Card>

        <Card className="bg-brand-light/80 backdrop-blur border-white/10 p-5">
          <div className="flex items-center justify-between text-white/60">
            <span className="text-xs font-semibold uppercase tracking-wider">Remaining Balance</span>
            <span className="grid h-7 w-7 place-items-center rounded bg-green-500/20 text-green-400"><IndianRupee className="h-4 w-4" /></span>
          </div>
          <p className={`mt-3 text-2xl font-bold ${(budgetSummary.remainingAmount || 0) < 0 ? 'text-red-400' : 'text-green-400'}`}>
            {currency(budgetSummary.remainingAmount || 0)}
          </p>
        </Card>
      </div>

      {/* Main Split Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Itinerary Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-brand-light/80 backdrop-blur border border-white/10 p-6">
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded bg-active-gradient text-brand"><ListTodo className="h-4 w-4" /></span>
                <h2 className="text-lg font-bold text-white tracking-tight">Timeline & Itinerary</h2>
              </div>
              <Button
                onClick={() => { setEditing(null); setModalOpen(true); }}
                className="bg-active-gradient hover:opacity-90 text-brand font-bold rounded-xl text-xs py-2 px-3.5 shadow-active-glow"
              >
                <Plus className="h-4 w-4" /> Add Activity
              </Button>
            </div>

            {sortedItinerary.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-white/5 border border-white/10 text-white/40 mb-4">
                  <Calendar className="h-5 w-5" />
                </span>
                <p className="text-sm text-white/60 font-medium">No activities mapped out yet</p>
              </div>
            ) : (
              <div className="relative pl-6 border-l-2 border-white/10 space-y-8 ml-3 py-2">
                {sortedItinerary.map((item) => (
                  <div key={item.id} className="relative group">
                    <span className="absolute -left-10 top-0.5 grid h-7 w-7 place-items-center rounded-full bg-active-gradient text-[10px] font-bold text-brand">
                      {item.dayNumber}
                    </span>

                    <div className="rounded-xl bg-[#0A1A3A]/60 backdrop-blur border-white/10 p-5">
                      <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
                        {item.time && (
                          <span className="flex items-center gap-1 font-mono font-bold bg-active-gradient px-2 py-0.5 rounded-md">
                            <Clock className="h-3 w-3" /> {item.time.slice(0, 5)}
                          </span>
                        )}
                        {item.activityType && (
                          <span className="px-2 py-0.5 bg-brand-light text-white rounded-md font-semibold uppercase tracking-wide text-[10px]">
                            {item.activityType}
                          </span>
                        )}
                        {item.location && (
                          <span className="flex items-center gap-1 text-white/70">
                            <MapPin className="h-3 w-3" /> {item.location}
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">Day {item.dayNumber} Overview</span>
                      <h3 className="text-base font-bold text-white leading-snug mt-1">{item.title || 'Untitled Activity'}</h3>

                      {item.description && (
                        <p className="text-white/80 text-sm mt-2 leading-relaxed">{item.description}</p>
                      )}

                      <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => { setEditing(item); setModalOpen(true); }}
                          className="rounded-lg p-1.5 text-white/60 hover:text-amber-400 hover:bg-white/10 transition"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeItinerary(item.id)}
                          className="rounded-lg p-1.5 text-white/60 hover:text-red-400 hover:bg-white/10 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Expenses Snapshot */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-brand-light/80 backdrop-blur border-white/10 p-6">
            <h2 className="text-lg font-bold text-white tracking-tight mb-4">Recent Expenses</h2>
            <div className="divide-y divide-white/10">
              {expenses.length === 0 ? (
                <div className="py-8 text-center text-sm text-white/50">No expenses logged yet.</div>
              ) : (
                expenses.slice(0, 5).map((expense) => (
                  <div key={expense.id} className="flex justify-between items-center py-3 text-sm">
                    <div>
                      <span className="font-semibold text-white">{expense.category}</span>
                      <span className="block text-[10px] text-white/50">{dateLabel(expense.expenseDate)}</span>
                    </div>
                    <span className="font-semibold text-white">{currency(expense.amount)}</span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Modal */}
      <Modal open={modalOpen} title={editing ? 'Edit Activity' : 'Add Activity'} onClose={() => setModalOpen(false)}>
        <form onSubmit={saveItinerary} className="flex-col h-full">
          <div className="space-y-3">
            <FormInput label="Day Number" name="dayNumber" type="number" min="1" defaultValue={editing?.dayNumber || 1} required />
            <FormInput label="Time" name="time" type="time" defaultValue={editing?.time || ''} className="[color-scheme:dark]" />
            <FormInput label="Activity Type" name="activityType" as="select" defaultValue={editing?.activityType || 'SIGHTSEEING'}>
              <option value="SIGHTSEEING" className="bg-[#0B1224] text-white">SIGHTSEEING</option>
              <option value="DINING" className="bg-[#0B1224] text-white">DINING</option>
              <option value="ACCOMMODATION" className="bg-[#0B1224] text-white">ACCOMMODATION</option>
              <option value="TRANSPORTATION" className="bg-[#0B1224] text-white">TRANSPORTATION</option>
              <option value="ADVENTURE ACTIVITIES" className="bg-[#0B1224] text-white">ADVENTURE ACTIVITIES</option>
              <option value="SHOPPING" className="bg-[#0B1224] text-white">SHOPPING</option>
            </FormInput>
            <FormInput label="Location" name="location" placeholder="e.g. Munnar, Kerala" defaultValue={editing?.location || ''} />
            <FormInput label="Activity Title" name="title" placeholder="Visit Tea Gardens" defaultValue={editing?.title || ''} required />
            <FormInput label="Description" name="description" as="textarea" rows="2" placeholder="Add notes..." defaultValue={editing?.description || ''} />
          </div>

          {/* Buttons - ALWAYS VISIBLE */}
          <div className="flex justify-end gap-3 pt-3 mt-3 border-t border-white/10">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit"><CalendarPlus className="h-4 w-4" /> Save Activity</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}