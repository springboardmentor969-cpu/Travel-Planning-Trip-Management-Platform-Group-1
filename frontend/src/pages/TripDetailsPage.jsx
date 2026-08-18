import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Clock,
  PlusCircle,
  Edit3,
  Trash2,
  Share2,
  FileText,
  MessageSquare,
  CloudSun,
  PieChart,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Download,
  Send,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

const ACTIVITY_TYPES = [
  'SIGHTSEEING',
  'TRANSPORTATION',
  'ACCOMMODATION',
  'DINING',
  'ADVENTURE',
  'SHOPPING',
  'OTHER'
];

const EXPENSE_CATEGORIES = [
  'TRANSPORTATION',
  'HOTEL',
  'FOOD',
  'SHOPPING',
  'ENTERTAINMENT',
  'MISCELLANEOUS'
];

const DOC_CATEGORIES = [
  'TICKET',
  'HOTEL_BOOKING',
  'PASSPORT_VISA',
  'PHOTO',
  'RECEIPT',
  'OTHER'
];

const TripDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error } = useToast();

  const [trip, setTrip] = useState(null);
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [members, setMembers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [settlement, setSettlement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, itinerary, budget, group, documents, discussions

  // Modals state
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [selectedItineraryId, setSelectedItineraryId] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);
  const [activityForm, setActivityForm] = useState({
    title: '',
    activityType: 'SIGHTSEEING',
    startTime: '10:00',
    endTime: '12:00',
    durationMinutes: 120,
    locationName: '',
    address: '',
    estimatedCost: 0,
    actualCost: 0,
    notes: '',
    reminderSet: false
  });

  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    amount: '',
    category: 'FOOD',
    expenseDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'CASH',
    notes: ''
  });

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('MEMBER');

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadCategory, setUploadCategory] = useState('TICKET');
  const [uploadDesc, setUploadDesc] = useState('');

  const [editTripModalOpen, setEditTripModalOpen] = useState(false);
  const [editTripForm, setEditTripForm] = useState({});

  const [newMessage, setNewMessage] = useState('');

  const fetchTripDetails = async () => {
    try {
      const res = await api.get(`/trips/${id}`);
      if (res.data?.data) {
        const tripData = res.data.data;
        setTrip(tripData);
        setEditTripForm({
          title: tripData.title,
          description: tripData.description || '',
          destination: tripData.destination,
          startDate: tripData.startDate,
          endDate: tripData.endDate,
          totalBudget: tripData.totalBudget,
          status: tripData.status,
          visibility: tripData.visibility,
          coverImageUrl: tripData.coverImageUrl
        });
      }
    } catch (err) {
      error('Failed to load trip details');
      navigate('/trips');
    }
  };

  const fetchSubData = async () => {
    try {
      const [budgetRes, expensesRes, membersRes, docsRes, messagesRes, weatherRes] = await Promise.all([
        api.get(`/trips/${id}/budget`).catch(() => ({ data: { data: null } })),
        api.get(`/trips/${id}/expenses`).catch(() => ({ data: { data: [] } })),
        api.get(`/trips/${id}/members`).catch(() => ({ data: { data: [] } })),
        api.get(`/trips/${id}/documents`).catch(() => ({ data: { data: [] } })),
        api.get(`/trips/${id}/discussions`).catch(() => ({ data: { data: [] } })),
        api.get(`/destinations/1/weather`).catch(() => ({ data: { data: null } }))
      ]);

      if (budgetRes.data?.data) setBudget(budgetRes.data.data);
      if (expensesRes.data?.data) setExpenses(expensesRes.data.data);
      if (membersRes.data?.data) setMembers(membersRes.data.data);
      if (docsRes.data?.data) setDocuments(docsRes.data.data);
      if (messagesRes.data?.data) setDiscussions(messagesRes.data.data);
      if (weatherRes.data?.data) setWeather(weatherRes.data.data);

      // Settlement
      try {
        const setRes = await api.get(`/trips/${id}/members/settlement`);
        if (setRes.data?.data) setSettlement(setRes.data.data);
      } catch (err) {}
    } catch (err) {
      console.error('Error fetching trip subdata:', err);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await fetchTripDetails();
      await fetchSubData();
      setLoading(false);
    };
    loadAll();
  }, [id]);

  // Activity Handlers
  const handleOpenAddActivity = (itineraryId) => {
    setSelectedItineraryId(itineraryId);
    setEditingActivity(null);
    setActivityForm({
      title: '',
      activityType: 'SIGHTSEEING',
      startTime: '10:00',
      endTime: '12:00',
      durationMinutes: 120,
      locationName: '',
      address: '',
      estimatedCost: 0,
      actualCost: 0,
      notes: '',
      reminderSet: false
    });
    setActivityModalOpen(true);
  };

  const handleOpenEditActivity = (activity) => {
    setEditingActivity(activity);
    setSelectedItineraryId(activity.itineraryId);
    setActivityForm({
      title: activity.title,
      activityType: activity.activityType,
      startTime: activity.startTime || '10:00',
      endTime: activity.endTime || '12:00',
      durationMinutes: activity.durationMinutes || 120,
      locationName: activity.locationName || '',
      address: activity.address || '',
      estimatedCost: activity.estimatedCost || 0,
      actualCost: activity.actualCost || 0,
      notes: activity.notes || '',
      reminderSet: activity.reminderSet || false
    });
    setActivityModalOpen(true);
  };

  const handleSaveActivity = async (e) => {
    e.preventDefault();
    try {
      if (editingActivity) {
        await api.put(`/activities/${editingActivity.id}`, activityForm);
        success('Activity updated successfully!');
      } else {
        await api.post(`/itineraries/${selectedItineraryId}/activities`, activityForm);
        success('Activity added to itinerary day!');
      }
      setActivityModalOpen(false);
      fetchTripDetails();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to save activity');
    }
  };

  const handleDeleteActivity = async (activityId) => {
    try {
      await api.delete(`/activities/${activityId}`);
      success('Activity deleted');
      fetchTripDetails();
    } catch (err) {
      error('Failed to delete activity');
    }
  };

  const handleAddDay = async () => {
    try {
      await api.post(`/trips/${id}/itineraries`, {});
      success('New itinerary day added!');
      fetchTripDetails();
    } catch (err) {
      error('Failed to add itinerary day');
    }
  };

  // Expense Handlers
  const handleSaveExpense = async (e) => {
    e.preventDefault();
    if (!expenseForm.title || !expenseForm.amount) {
      error('Please provide expense title and amount');
      return;
    }

    try {
      if (editingExpense) {
        await api.put(`/expenses/${editingExpense.id}`, expenseForm);
        success('Expense updated');
      } else {
        await api.post(`/trips/${id}/expenses`, expenseForm);
        success('Expense recorded and budget updated!');
      }
      setExpenseModalOpen(false);
      setEditingExpense(null);
      fetchTripDetails();
      fetchSubData();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to save expense');
    }
  };

  const handleDeleteExpense = async (expId) => {
    try {
      await api.delete(`/expenses/${expId}`);
      success('Expense deleted');
      fetchTripDetails();
      fetchSubData();
    } catch (err) {
      error('Failed to delete expense');
    }
  };

  // Group Member Handlers
  const handleInviteMember = async (e) => {
    e.preventDefault();
    if (!inviteEmail) {
      error('Please enter an email address');
      return;
    }

    try {
      await api.post(`/trips/${id}/members/invite`, {
        email: inviteEmail,
        role: inviteRole
      });
      success(`Invitation sent to ${inviteEmail}!`);
      setInviteModalOpen(false);
      setInviteEmail('');
      fetchSubData();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to send invitation');
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await api.delete(`/trips/${id}/members/${userId}`);
      success('Member removed from trip');
      fetchSubData();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to remove member');
    }
  };

  // Document Upload Handlers
  const handleUploadDocument = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      error('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('category', uploadCategory);
    formData.append('description', uploadDesc);

    try {
      await api.post(`/trips/${id}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      success('Document uploaded to trip vault!');
      setUploadModalOpen(false);
      setUploadFile(null);
      setUploadDesc('');
      fetchSubData();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to upload document');
    }
  };

  const handleDeleteDocument = async (docId) => {
    try {
      await api.delete(`/documents/${docId}`);
      success('Document deleted');
      fetchSubData();
    } catch (err) {
      error('Failed to delete document');
    }
  };

  // Discussion Post Handler
  const handlePostMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await api.post(`/trips/${id}/discussions`, { message: newMessage });
      setNewMessage('');
      const res = await api.get(`/trips/${id}/discussions`);
      if (res.data?.data) setDiscussions(res.data.data);
    } catch (err) {
      error('Failed to post message');
    }
  };

  // Edit Trip Details Handler
  const handleUpdateTrip = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/trips/${id}`, editTripForm);
      success('Trip details updated!');
      setEditTripModalOpen(false);
      fetchTripDetails();
      fetchSubData();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update trip');
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading trip details..." />;
  }

  if (!trip) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Breadcrumb & Share Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/trips"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Trips
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const url = `${window.location.origin}/trips/share/${trip.shareCode}`;
              navigator.clipboard.writeText(url);
              success('Shareable trip link copied to clipboard!');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Share Trip</span>
          </button>

          <button
            onClick={() => setEditTripModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-2xs transition"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Trip</span>
          </button>
        </div>
      </div>

      {/* Hero Banner Card */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-100 bg-slate-900 text-white">
        <div className="h-64 sm:h-72 w-full relative">
          <img
            src={
              trip.coverImageUrl ||
              'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&auto=format&fit=crop&q=80'
            }
            alt={trip.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          <div className="absolute top-6 left-6 flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500 text-slate-950 font-extrabold text-xs rounded-full uppercase tracking-wider">
              {trip.status}
            </span>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white font-bold text-xs rounded-full uppercase">
              {trip.visibility}
            </span>
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-semibold">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>{trip.destination}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{trip.title}</h1>
              {trip.description && (
                <p className="text-xs text-slate-300 max-w-2xl line-clamp-1">{trip.description}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-200">
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>
                  {trip.startDate} - {trip.endDate} ({trip.daysCount} Days)
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>
                  Budget: ${trip.totalBudget} (Spent: ${trip.totalExpenses})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {[
          { id: 'overview', label: 'Overview & Guide', icon: Compass },
          { id: 'itinerary', label: 'Day-Wise Itinerary', icon: Calendar },
          { id: 'budget', label: 'Budget & Expenses', icon: DollarSign },
          { id: 'group', label: `Travelers (${members.length})`, icon: Users },
          { id: 'documents', label: `Documents (${documents.length})`, icon: FileText },
          { id: 'discussions', label: `Discussions (${discussions.length})`, icon: MessageSquare }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Areas */}
      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-center">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Planned Days</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{trip.itineraries?.length || 0}</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-center">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Total Activities</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{trip.activityCount || 0}</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-center">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Remaining Budget</span>
                <div className="text-2xl font-black text-emerald-600 mt-1">${trip.remainingBudget || 0}</div>
              </div>
            </div>

            {/* Itinerary Preview */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Itinerary Schedule Overview</h3>
                <button
                  onClick={() => setActiveTab('itinerary')}
                  className="text-xs font-bold text-emerald-600 hover:underline"
                >
                  Manage Activities &rarr;
                </button>
              </div>

              <div className="space-y-3">
                {trip.itineraries?.slice(0, 3).map((it) => (
                  <div key={it.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        Day {it.dayNumber}: {it.title}
                      </span>
                      <span className="text-[11px] text-slate-500">{it.date}</span>
                    </div>
                    <div className="text-xs text-slate-600 flex items-center gap-2">
                      <span className="font-semibold text-emerald-600">
                        {it.activities?.length || 0} scheduled activities
                      </span>
                      {it.activities && it.activities.length > 0 && (
                        <span>• First: {it.activities[0].title} ({it.activities[0].startTime})</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Weather & Map */}
          <div className="lg:col-span-4 space-y-6">
            {/* Live Weather Forecast Widget */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-3xl shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                    Destination Weather
                  </span>
                  <h4 className="text-base font-bold text-white">{trip.destination.split(',')[0]}</h4>
                </div>
                <CloudSun className="w-8 h-8 text-amber-400" />
              </div>
              <div className="text-3xl font-extrabold">22°C <span className="text-sm font-normal text-slate-300">Sunny</span></div>
              <p className="text-xs text-slate-400">Great conditions expected during your travel window.</p>
            </div>

            {/* Travel Companions Quick List */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Trip Companions</h3>
                <button
                  onClick={() => setActiveTab('group')}
                  className="text-xs font-bold text-emerald-600 hover:underline"
                >
                  Invite +
                </button>
              </div>
              <div className="space-y-2">
                {members.map((m) => (
                  <div key={m.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50">
                    <img
                      src={
                        m.avatarUrl ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(m.fullName)}`
                      }
                      alt={m.fullName}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate">{m.fullName}</div>
                      <div className="text-[10px] text-slate-400">{m.groupRole}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ITINERARY TAB */}
      {activeTab === 'itinerary' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Day-Wise Itinerary Plan</h2>
              <p className="text-xs text-slate-500">
                Organize sightseeing, transportation, accommodation, and dining step by step.
              </p>
            </div>
            <button
              onClick={handleAddDay}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition"
            >
              <PlusCircle className="w-4 h-4" /> Add Next Day
            </button>
          </div>

          <div className="space-y-6">
            {trip.itineraries?.map((day) => (
              <div
                key={day.id}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4"
              >
                {/* Day Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-sm shadow-sm">
                      D{day.dayNumber}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{day.title}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" /> {day.date}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenAddActivity(day.id)}
                    className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold px-3.5 py-2 rounded-xl transition"
                  >
                    <PlusCircle className="w-4 h-4 text-emerald-600" />
                    <span>Add Activity</span>
                  </button>
                </div>

                {/* Activities Timeline */}
                {day.activities && day.activities.length > 0 ? (
                  <div className="space-y-3 pt-2">
                    {day.activities.map((act) => (
                      <div
                        key={act.id}
                        className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-emerald-200 transition gap-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                            <Clock className="w-4 h-4 text-emerald-600" />
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-900">{act.title}</span>
                              <span className="px-2 py-0.5 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold rounded-md uppercase">
                                {act.activityType}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                              <span className="font-medium text-emerald-700">
                                {act.startTime} ({act.durationMinutes} mins)
                              </span>
                              {act.locationName && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                  {act.locationName}
                                </span>
                              )}
                              {act.estimatedCost > 0 && (
                                <span className="font-bold text-slate-800">
                                  Est: ${act.estimatedCost}
                                </span>
                              )}
                            </div>

                            {act.notes && (
                              <p className="text-xs text-slate-600 pt-0.5">{act.notes}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() => handleOpenEditActivity(act)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-white transition"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteActivity(act.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-2xl text-xs text-slate-400 space-y-2">
                    <p>No activities scheduled for Day {day.dayNumber} yet.</p>
                    <button
                      onClick={() => handleOpenAddActivity(day.id)}
                      className="text-emerald-600 font-bold hover:underline"
                    >
                      + Click here to add your first activity
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. BUDGET & EXPENSES TAB */}
      {activeTab === 'budget' && (
        <div className="space-y-6">
          {/* Budget Overview Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Trip Financial Tracker</h3>
                <p className="text-xs text-slate-500">
                  Monitor allocated budgets, categorize expenses, and prevent overspending.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingExpense(null);
                  setExpenseForm({
                    title: '',
                    amount: '',
                    category: 'FOOD',
                    expenseDate: new Date().toISOString().split('T')[0],
                    paymentMethod: 'CASH',
                    notes: ''
                  });
                  setExpenseModalOpen(true);
                }}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition"
              >
                <PlusCircle className="w-4 h-4" /> Record New Expense
              </button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-600">
                  Total Spent: <span className="text-slate-900">${budget?.totalSpent || 0}</span> / ${budget?.totalAmount || 0}
                </span>
                <span className={budget?.utilizationPercentage > 100 ? 'text-rose-600 font-extrabold' : 'text-emerald-600'}>
                  {budget?.utilizationPercentage || 0}% Utilized
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    budget?.utilizationPercentage > 100
                      ? 'bg-rose-500'
                      : budget?.utilizationPercentage > 80
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, budget?.utilizationPercentage || 0)}%` }}
                />
              </div>
            </div>

            {/* Category breakdown cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-center">
              {EXPENSE_CATEGORIES.map((cat) => {
                const spent = budget?.spentByCategory?.[cat] || 0;
                return (
                  <div key={cat} className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase truncate block">
                      {cat}
                    </span>
                    <span className="text-sm font-extrabold text-slate-800 mt-1 block">
                      ${spent}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Expenses Table */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-900">Recorded Expenses ({expenses.length})</h4>
            </div>

            {expenses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-3.5">Expense Title</th>
                      <th className="px-6 py-3.5">Category</th>
                      <th className="px-6 py-3.5">Date</th>
                      <th className="px-6 py-3.5">Paid By</th>
                      <th className="px-6 py-3.5 text-right">Amount</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {expenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-slate-50/60 transition">
                        <td className="px-6 py-4 font-bold text-slate-900">{exp.title}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                            {exp.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{exp.expenseDate}</td>
                        <td className="px-6 py-4 font-medium text-slate-800">{exp.paidByName || 'Me'}</td>
                        <td className="px-6 py-4 text-right font-extrabold text-slate-900 text-sm">
                          ${exp.amount}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteExpense(exp.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-10 text-center text-xs text-slate-400">
                No expenses recorded yet. Click "Record New Expense" above to start logging.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. GROUP & SPLITS TAB */}
      {activeTab === 'group' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Group Travel Companions</h3>
              <p className="text-xs text-slate-500">
                Collaborate on day-wise schedules and calculate equal expense splits.
              </p>
            </div>

            <button
              onClick={() => setInviteModalOpen(true)}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition"
            >
              <PlusCircle className="w-4 h-4" /> Invite Companion
            </button>
          </div>

          {/* Members List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {members.map((m) => (
              <div
                key={m.id}
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={
                      m.avatarUrl ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(m.fullName)}`
                    }
                    alt={m.fullName}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-100"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">{m.fullName}</div>
                    <div className="text-[10px] text-slate-400 truncate">{m.email}</div>
                    <span className="inline-block mt-0.5 px-2 py-0.2 rounded bg-emerald-50 text-emerald-700 text-[9px] font-bold uppercase">
                      {m.groupRole} • {m.inviteStatus}
                    </span>
                  </div>
                </div>

                {m.userId !== user?.id && (
                  <button
                    onClick={() => handleRemoveMember(m.userId)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                    title="Remove Member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Settlement / Balance Calculator */}
          {settlement && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <h4 className="text-base font-bold text-slate-900">Equal Expense Split Breakdown</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Total Group Spend</span>
                  <div className="text-xl font-extrabold text-slate-900 mt-1">${settlement.totalExpenses}</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Equal Share Per Person</span>
                  <div className="text-xl font-extrabold text-emerald-600 mt-1">${settlement.equalSharePerMember}</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Active Group Members</span>
                  <div className="text-xl font-extrabold text-slate-900 mt-1">{settlement.totalMembers}</div>
                </div>
              </div>

              {/* Settlement Transfer Proposals */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold uppercase text-slate-500">Suggested Transfers to Settle Balances</span>
                {settlement.settlements && settlement.settlements.length > 0 ? (
                  <div className="space-y-2">
                    {settlement.settlements.map((trans, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs"
                      >
                        <div className="font-semibold text-emerald-950">
                          <span className="font-bold text-slate-900">{trans.fromUser}</span> pays{' '}
                          <span className="font-bold text-slate-900">{trans.toUser}</span>
                        </div>
                        <span className="font-black text-emerald-700 text-sm">${trans.amount}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 p-4 text-center bg-slate-50 rounded-xl">
                    All balances are currently settled.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. DOCUMENTS TAB */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Secure Document Vault</h3>
              <p className="text-xs text-slate-500">
                Store flight tickets, hotel booking PDFs, visa records, and memorable travel photos.
              </p>
            </div>

            <button
              onClick={() => setUploadModalOpen(true)}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition"
            >
              <Upload className="w-4 h-4" /> Upload Document / Photo
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {documents.length > 0 ? (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4 hover:border-emerald-200 transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate" title={doc.originalFileName}>
                        {doc.originalFileName}
                      </h4>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[9px] font-bold uppercase">
                        {doc.category}
                      </span>
                      {doc.description && (
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{doc.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-[10px] text-slate-400">
                      {Math.round((doc.fileSize || 0) / 1024)} KB
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href={`http://localhost:8080/api/documents/${doc.id}/download`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-50 rounded-lg transition"
                        title="Download Document"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Delete Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm space-y-3">
                <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800">No documents uploaded yet</h4>
                <p className="text-xs text-slate-500">
                  Upload boarding passes, hotel confirmations, or travel photos to keep everything in one place.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. DISCUSSIONS TAB */}
      {activeTab === 'discussions' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Trip Discussion Stream</span>
            </h3>
            <span className="text-xs text-slate-500">{discussions.length} messages</span>
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {discussions.length > 0 ? (
              discussions.map((msg) => {
                const isMe = msg.senderId === user?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
                  >
                    <img
                      src={
                        msg.senderAvatarUrl ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                          msg.senderName || 'User'
                        )}`
                      }
                      alt={msg.senderName}
                      className="w-8 h-8 rounded-xl object-cover shrink-0 ring-1 ring-slate-200"
                    />
                    <div
                      className={`max-w-md rounded-2xl p-3 text-xs space-y-1 ${
                        isMe
                          ? 'bg-emerald-600 text-white rounded-tr-none'
                          : 'bg-slate-100 text-slate-800 rounded-tl-none'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 text-[10px] opacity-80">
                        <span className="font-bold">{msg.senderName}</span>
                        <span>{new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No discussion messages yet. Send a note to your travel group below!
              </div>
            )}
          </div>

          <form onSubmit={handlePostMessage} className="p-4 border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message or share an itinerary note..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}

      {/* Activity Modal */}
      <Modal
        isOpen={activityModalOpen}
        onClose={() => setActivityModalOpen(false)}
        title={editingActivity ? 'Edit Scheduled Activity' : 'Add Activity to Itinerary'}
      >
        <form onSubmit={handleSaveActivity} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Activity Title *</label>
            <input
              type="text"
              required
              value={activityForm.title}
              onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
              placeholder="e.g. Guided Louvre Museum Tour"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Activity Type</label>
              <select
                value={activityForm.activityType}
                onChange={(e) => setActivityForm({ ...activityForm, activityType: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              >
                {ACTIVITY_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Start Time</label>
              <input
                type="time"
                value={activityForm.startTime}
                onChange={(e) => setActivityForm({ ...activityForm, startTime: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location Name</label>
              <input
                type="text"
                value={activityForm.locationName}
                onChange={(e) => setActivityForm({ ...activityForm, locationName: e.target.value })}
                placeholder="e.g. Eiffel Tower"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Estimated Cost ($)</label>
              <input
                type="number"
                min="0"
                value={activityForm.estimatedCost}
                onChange={(e) => setActivityForm({ ...activityForm, estimatedCost: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Notes &amp; Booking Details</label>
            <textarea
              rows={2}
              value={activityForm.notes}
              onChange={(e) => setActivityForm({ ...activityForm, notes: e.target.value })}
              placeholder="Ticket reference #, dress code, instructions..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setActivityModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow"
            >
              Save Activity
            </button>
          </div>
        </form>
      </Modal>

      {/* Expense Modal */}
      <Modal
        isOpen={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        title="Record Trip Expense"
      >
        <form onSubmit={handleSaveExpense} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Expense Title *</label>
            <input
              type="text"
              required
              value={expenseForm.title}
              onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
              placeholder="e.g. Dinner at Trattoria Romana"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Amount ($ USD) *</label>
              <input
                type="number"
                required
                min="1"
                step="0.01"
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                placeholder="45.00"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
              <select
                value={expenseForm.category}
                onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date</label>
              <input
                type="date"
                required
                value={expenseForm.expenseDate}
                onChange={(e) => setExpenseForm({ ...expenseForm, expenseDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Payment Method</label>
              <select
                value={expenseForm.paymentMethod}
                onChange={(e) => setExpenseForm({ ...expenseForm, paymentMethod: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              >
                <option value="CASH">CASH</option>
                <option value="CREDIT_CARD">CREDIT_CARD</option>
                <option value="DEBIT_CARD">DEBIT_CARD</option>
                <option value="UPI">UPI</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Notes</label>
            <input
              type="text"
              value={expenseForm.notes}
              onChange={(e) => setExpenseForm({ ...expenseForm, notes: e.target.value })}
              placeholder="Shared appetizer, drinks, receipt notes..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setExpenseModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow"
            >
              Save Expense
            </button>
          </div>
        </form>
      </Modal>

      {/* Invite Member Modal */}
      <Modal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        title="Invite Travel Companion"
      >
        <form onSubmit={handleInviteMember} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">User Email Address *</label>
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="e.g. david@tripnest.com"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Group Role</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            >
              <option value="MEMBER">Member (Can view, comment, add expenses)</option>
              <option value="GROUP_ADMIN">Group Admin (Can edit itinerary &amp; invite)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setInviteModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow"
            >
              Send Invite
            </button>
          </div>
        </form>
      </Modal>

      {/* Upload Document Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload Document / Booking"
      >
        <form onSubmit={handleUploadDocument} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Select File (PDF, PNG, JPG) *</label>
            <input
              type="file"
              required
              onChange={(e) => setUploadFile(e.target.files[0])}
              className="w-full text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
            <select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            >
              {DOC_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description / Notes</label>
            <input
              type="text"
              value={uploadDesc}
              onChange={(e) => setUploadDesc(e.target.value)}
              placeholder="e.g. Return flight boarding passes"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setUploadModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow"
            >
              Upload to Vault
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Trip Modal */}
      <Modal
        isOpen={editTripModalOpen}
        onClose={() => setEditTripModalOpen(false)}
        title="Edit Trip Settings"
      >
        <form onSubmit={handleUpdateTrip} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Trip Title</label>
            <input
              type="text"
              required
              value={editTripForm.title || ''}
              onChange={(e) => setEditTripForm({ ...editTripForm, title: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Status</label>
              <select
                value={editTripForm.status || 'PLANNED'}
                onChange={(e) => setEditTripForm({ ...editTripForm, status: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
              >
                <option value="PLANNED">PLANNED</option>
                <option value="ONGOING">ONGOING</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Total Budget ($)</label>
              <input
                type="number"
                value={editTripForm.totalBudget || 0}
                onChange={(e) => setEditTripForm({ ...editTripForm, totalBudget: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditTripModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow"
            >
              Save Settings
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TripDetailsPage;
