import { CalendarPlus, Clock3, Edit, Plus, ReceiptText, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getErrorMessage } from '../api/client';
import { itineraryApi, tripApi } from '../api/tripService';
import Button from '../components/Button';
import Card from '../components/Card';
import FormInput from '../components/FormInput';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { useAuth } from '../contexts/AuthContext';
import { currency, dateLabel } from '../utils';

const activityTypes = [
  { value: 'SIGHTSEEING', label: 'Sightseeing' },
  { value: 'TRANSPORTATION', label: 'Transportation' },
  { value: 'ACCOMMODATION', label: 'Accommodation' },
  { value: 'DINING', label: 'Dining' },
  { value: 'ADVENTURE', label: 'Adventure' },
  { value: 'SHOPPING', label: 'Shopping' },
  { value: 'OTHER', label: 'Other' }
];

const formatActivityType = (value) => activityTypes.find((option) => option.value === value)?.label || value || 'Sightseeing';
const formatActivityTime = (value) => (value ? value.slice(0, 5) : '09:00');

export default function TripDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [details, setDetails] = useState(null);
  const [invites, setInvites] = useState([]);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [collaboratorEmail, setCollaboratorEmail] = useState('');
  const [collaboratorError, setCollaboratorError] = useState('');
  const [collaboratorSaving, setCollaboratorSaving] = useState(false);

  const load = async () => {
    const [tripDetails, tripInvites] = await Promise.all([
      tripApi.details(id),
      tripApi.listInvites(id)
    ]);
    setDetails(tripDetails);
    setInvites(tripInvites);
    setError('');
  };

  useEffect(() => {
    let active = true;

    const refresh = async () => {
      try {
        const [tripDetails, tripInvites] = await Promise.all([
          tripApi.details(id),
          tripApi.listInvites(id)
        ]);
        if (!active) return;
        setDetails(tripDetails);
        setInvites(tripInvites);
        setError('');
      } catch (err) {
        if (!active) return;
        setError(getErrorMessage(err));
      }
    };

    refresh();
    const intervalId = window.setInterval(refresh, 10000);
    window.addEventListener('focus', refresh);

    return () => {
      active = false;
      window.clearInterval(intervalId);
      window.removeEventListener('focus', refresh);
    };
  }, [id]);

  const saveItinerary = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      dayNumber: Number(form.get('dayNumber')),
      title: form.get('title'),
      description: form.get('description'),
      activityType: form.get('activityType'),
      activityTime: form.get('activityTime')
    };
    if (editing?.id) await itineraryApi.update(id, editing.id, payload);
    else await itineraryApi.create(id, payload);
    setModalOpen(false);
    setEditing(null);
    load();
  };

  const removeItinerary = async (itemId) => {
    await itineraryApi.remove(id, itemId);
    load();
  };

  const addCollaborator = async (event) => {
    event.preventDefault();
    setCollaboratorSaving(true);
    setCollaboratorError('');
    try {
      await tripApi.inviteCollaborator(id, collaboratorEmail);
      setCollaboratorEmail('');
      load();
    } catch (err) {
      setCollaboratorError(getErrorMessage(err));
    } finally {
      setCollaboratorSaving(false);
    }
  };

  const removeCollaborator = async (collaboratorId) => {
    await tripApi.removeCollaborator(id, collaboratorId);
    load();
  };

  if (error) return <Card><p className="text-sm text-red-600">{error}</p></Card>;
  if (!details) return <LoadingSpinner label="Loading trip details" />;

  const { trip, itinerary, expenses, budgetSummary, collaborators = [] } = details;
  const isOwner = user?.id === trip.userId;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">{trip.title}</h1>
          <p className="mt-1 text-sm text-slate-500">{trip.destination} · {dateLabel(trip.startDate)} - {dateLabel(trip.endDate)}</p>
          {!isOwner && <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Shared trip access</p>}
        </div>
        <div className="flex gap-2">
          <Link to={`/trips/${id}/expenses`}><Button variant="secondary"><ReceiptText className="h-4 w-4" />Expenses</Button></Link>
          {isOwner && <Link to={`/trips/${id}/edit`}><Button><Edit className="h-4 w-4" />Edit</Button></Link>}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><p className="text-sm text-slate-500">Budget</p><p className="mt-1 text-xl font-semibold">{currency(budgetSummary.budget)}</p></Card>
        <Card><p className="text-sm text-slate-500">Spent</p><p className="mt-1 text-xl font-semibold">{currency(budgetSummary.totalExpenses)}</p></Card>
        <Card><p className="text-sm text-slate-500">Remaining</p><p className="mt-1 text-xl font-semibold text-green-700">{currency(budgetSummary.remainingAmount)}</p></Card>
      </div>
      <Card>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Collaborators</h2>
            <p className="mt-1 text-sm text-slate-500">Send an invite by email. The recipient can accept or reject it from their dashboard.</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{collaborators.length} member{collaborators.length === 1 ? '' : 's'}</span>
        </div>
        <div className="space-y-3">
          {collaborators.length === 0 ? (
            <p className="text-sm text-slate-500">No collaborators added yet.</p>
          ) : collaborators.map((member) => (
            <div key={member.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
              <div>
                <p className="font-medium text-slate-950">{member.name}</p>
                <p className="text-sm text-slate-500">{member.email}</p>
              </div>
              {isOwner && member.id !== trip.userId && (
                <button className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50" onClick={() => removeCollaborator(member.id)}>
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        {isOwner && (
          <form onSubmit={addCollaborator} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <FormInput
              label="Invite by email"
              name="collaboratorEmail"
              type="email"
              value={collaboratorEmail}
              onChange={(event) => setCollaboratorEmail(event.target.value)}
              placeholder="teammate@example.com"
              required
            />
            <div className="sm:pt-6">
              <Button type="submit" disabled={collaboratorSaving}><Plus className="h-4 w-4" />Invite</Button>
            </div>
          </form>
        )}
        {collaboratorError && <p className="mt-3 text-sm text-red-600">{collaboratorError}</p>}
      </Card>

      {isOwner && (
        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Pending invitations</h2>
              <p className="mt-1 text-sm text-slate-500">Watch who has been invited and whether they accepted or rejected.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{invites.length} total</span>
          </div>
          <div className="space-y-3">
            {invites.length === 0 ? (
              <p className="text-sm text-slate-500">No invitations sent yet.</p>
            ) : invites.map((invite) => (
              <div key={invite.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                <div>
                  <p className="font-medium text-slate-950">{invite.inviteeEmail}</p>
                  <p className="text-sm text-slate-500">Sent at {invite.createdAt ? dateLabel(invite.createdAt) : 'unknown'}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${invite.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-700' : invite.status === 'REJECTED' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>
                  {invite.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Itinerary</h2>
          <Button onClick={() => { setEditing(null); setModalOpen(true); }}><Plus className="h-4 w-4" />Add day</Button>
        </div>
        <div className="space-y-3">
          {itinerary.length === 0 ? (
            <p className="text-sm text-slate-500">No itinerary days yet.</p>
          ) : itinerary.map((item) => (
            <div key={item.id} className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-blue-600">Day {item.dayNumber}</p>
                  <h3 className="mt-1 font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{item.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 font-medium text-blue-700">{formatActivityType(item.activityType)}</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">
                      <Clock3 className="h-3.5 w-3.5" />
                      {formatActivityTime(item.activityTime)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="rounded-lg p-2 hover:bg-slate-100" onClick={() => { setEditing(item); setModalOpen(true); }}><Edit className="h-4 w-4" /></button>
                  <button className="rounded-lg p-2 text-red-600 hover:bg-red-50" onClick={() => removeItinerary(item.id)}><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h2 className="text-lg font-semibold">Recent expenses</h2>
        <div className="mt-4 divide-y divide-slate-100">
          {expenses.slice(0, 5).map((expense) => (
            <div key={expense.id} className="flex justify-between py-3 text-sm">
              <span>{expense.category}</span>
              <span className="font-medium">{currency(expense.amount)}</span>
            </div>
          ))}
          {expenses.length === 0 && <p className="text-sm text-slate-500">No expenses tracked yet.</p>}
        </div>
      </Card>
      <Modal open={modalOpen} title={editing ? 'Edit itinerary day' : 'Add itinerary day'} onClose={() => setModalOpen(false)}>
        <form onSubmit={saveItinerary} className="space-y-4">
          <FormInput label="Day number" name="dayNumber" type="number" min="1" defaultValue={editing?.dayNumber || 1} required />
          <FormInput label="Title" name="title" defaultValue={editing?.title || ''} required />
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Activity type</span>
            <select
              name="activityType"
              defaultValue={editing?.activityType || 'SIGHTSEEING'}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              {activityTypes.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <FormInput label="Activity time" name="activityTime" type="time" defaultValue={formatActivityTime(editing?.activityTime)} required />
          <FormInput label="Description" name="description" as="textarea" rows="4" defaultValue={editing?.description || ''} />
          <Button type="submit"><CalendarPlus className="h-4 w-4" />Save itinerary</Button>
        </form>
      </Modal>
    </div>
  );
}
