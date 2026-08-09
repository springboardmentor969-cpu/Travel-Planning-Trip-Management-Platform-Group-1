import { CalendarPlus, Clock3, Download, Edit, FileText, Plus, ReceiptText, Trash2, Upload, UserPlus, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getErrorMessage } from '../api/client';
import { itineraryApi, tripApi, tripDocumentApi, tripMemberApi } from '../api/tripService';
import Button from '../components/Button';
import Card from '../components/Card';
import FormInput from '../components/FormInput';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
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
  const [details, setDetails] = useState(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [memberError, setMemberError] = useState('');
  const [documents, setDocuments] = useState([]);
  const [documentError, setDocumentError] = useState('');
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    try {
      const tripDetails = await tripApi.details(id);
      setDetails(tripDetails);
      setMembers(await tripMemberApi.list(id));
      setDocuments(await tripDocumentApi.list(id));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  useEffect(() => {
    load();
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

  const addMember = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await tripMemberApi.add(id, { email: form.get('email'), role: form.get('role') });
      setMemberModalOpen(false);
      setMemberError('');
      load();
    } catch (err) {
      setMemberError(getErrorMessage(err));
    }
  };

  const updateMemberRole = async (userId, role) => {
    await tripMemberApi.update(id, userId, { role });
    load();
  };

  const removeMember = async (userId) => {
    await tripMemberApi.remove(id, userId);
    load();
  };

  const uploadDocument = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setDocumentError('');
    try { await tripDocumentApi.upload(id, file); await load(); }
    catch (err) { setDocumentError(getErrorMessage(err)); }
    finally { setUploading(false); event.target.value = ''; }
  };

  const downloadDocument = async (document) => {
    try {
      const blob = await tripDocumentApi.download(id, document.id);
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url; link.download = document.filename; link.click();
      URL.revokeObjectURL(url);
    } catch (err) { setDocumentError(getErrorMessage(err)); }
  };

  const removeDocument = async (documentId) => {
    try { await tripDocumentApi.remove(id, documentId); await load(); }
    catch (err) { setDocumentError(getErrorMessage(err)); }
  };

  if (error) return <Card><p className="text-sm text-red-600">{error}</p></Card>;
  if (!details) return <LoadingSpinner label="Loading trip details" />;

  const { trip, itinerary, expenses, budgetSummary, canEdit, isOwner } = details;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">{trip.title}</h1>
          <p className="mt-1 text-sm text-slate-500">{trip.destination} · {dateLabel(trip.startDate)} - {dateLabel(trip.endDate)}</p>
        </div>
        <div className="flex gap-2">
          <Link to={`/trips/${id}/expenses`}><Button variant="secondary"><ReceiptText className="h-4 w-4" />Expenses</Button></Link>
          {canEdit && <Link to={`/trips/${id}/edit`}><Button><Edit className="h-4 w-4" />Edit</Button></Link>}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><p className="text-sm text-slate-500">Budget</p><p className="mt-1 text-xl font-semibold">{currency(budgetSummary.budget)}</p></Card>
        <Card><p className="text-sm text-slate-500">Spent</p><p className="mt-1 text-xl font-semibold">{currency(budgetSummary.totalExpenses)}</p></Card>
        <Card><p className="text-sm text-slate-500">Remaining</p><p className="mt-1 text-xl font-semibold text-green-700">{currency(budgetSummary.remainingAmount)}</p></Card>
      </div>
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Itinerary</h2>
          {canEdit && <Button onClick={() => { setEditing(null); setModalOpen(true); }}><Plus className="h-4 w-4" />Add day</Button>}
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
                {canEdit && <div className="flex gap-1">
                  <button className="rounded-lg p-2 hover:bg-slate-100" onClick={() => { setEditing(item); setModalOpen(true); }}><Edit className="h-4 w-4" /></button>
                  <button className="rounded-lg p-2 text-red-600 hover:bg-red-50" onClick={() => removeItinerary(item.id)}><Trash2 className="h-4 w-4" /></button>
                </div>}
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold"><Users className="h-5 w-5 text-blue-600" />Trip members</h2>
            <p className="mt-1 text-sm text-slate-500">{isOwner ? 'Invite registered users and choose their access level.' : 'Everyone who can access this shared trip.'}</p>
          </div>
          {isOwner && <Button onClick={() => setMemberModalOpen(true)}><UserPlus className="h-4 w-4" />Add member</Button>}
        </div>
        <div className="divide-y divide-slate-100">
          {members.map((member) => (
            <div key={member.userId} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
              <div><p className="font-medium text-slate-900">{member.name}</p><p className="text-slate-500">{member.email}</p></div>
              {isOwner && member.role !== 'OWNER' ? (
                <div className="flex items-center gap-2">
                  <select aria-label={`Role for ${member.name}`} value={member.role} onChange={(event) => updateMemberRole(member.userId, event.target.value)} className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm">
                    <option value="EDITOR">Editor</option><option value="VIEWER">Viewer</option>
                  </select>
                  <button aria-label={`Remove ${member.name}`} onClick={() => removeMember(member.userId)} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><X className="h-4 w-4" /></button>
                </div>
              ) : <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{member.role}</span>}
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div><h2 className="flex items-center gap-2 text-lg font-semibold"><FileText className="h-5 w-5 text-blue-600" />Documents</h2><p className="mt-1 text-sm text-slate-500">PDF, image, Word, and travel documents up to 10 MB.</p></div>
          {canEdit && <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"><Upload className="h-4 w-4" />{uploading ? 'Uploading…' : 'Upload file'}<input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={uploadDocument} disabled={uploading} /></label>}
        </div>
        {documentError && <p className="mb-3 text-sm text-red-600">{documentError}</p>}
        <div className="divide-y divide-slate-100">
          {documents.map((document) => <div key={document.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm"><div><p className="font-medium text-slate-900">{document.filename}</p><p className="text-slate-500">Uploaded by {document.uploadedBy} · {(document.size / 1024 / 1024).toFixed(2)} MB</p></div><div className="flex gap-1"><button aria-label={`Download ${document.filename}`} onClick={() => downloadDocument(document)} className="rounded-lg p-2 text-blue-700 hover:bg-blue-50"><Download className="h-4 w-4" /></button>{canEdit && <button aria-label={`Delete ${document.filename}`} onClick={() => removeDocument(document.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>}</div></div>)}
          {documents.length === 0 && <p className="py-2 text-sm text-slate-500">No documents uploaded yet.</p>}
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
      <Modal open={memberModalOpen} title="Add trip member" onClose={() => { setMemberModalOpen(false); setMemberError(''); }}>
        <form onSubmit={addMember} className="space-y-4">
          <p className="text-sm text-slate-500">The user must already have a TripNest account.</p>
          {memberError && <p className="text-sm text-red-600">{memberError}</p>}
          <FormInput label="Email" name="email" type="email" required />
          <label className="block"><span className="mb-1 block text-sm font-medium text-slate-700">Access</span><select name="role" defaultValue="EDITOR" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"><option value="EDITOR">Editor — can update plans and expenses</option><option value="VIEWER">Viewer — read-only access</option></select></label>
          <Button type="submit"><UserPlus className="h-4 w-4" />Add member</Button>
        </form>
      </Modal>
    </div>
  );
}
