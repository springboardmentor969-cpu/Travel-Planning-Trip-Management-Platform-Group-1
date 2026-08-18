import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Compass,
  DollarSign,
  TrendingUp,
  PlusCircle,
  Trash2,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
  Lock,
  Edit3
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

const AdminDashboardPage = () => {
  const { success, error } = useToast();

  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users'); // users, trips, destinations

  // Add destination modal
  const [destModalOpen, setDestModalOpen] = useState(false);
  const [destForm, setDestForm] = useState({
    name: '',
    country: '',
    city: '',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=80',
    category: 'Cultural',
    bestTimeToVisit: 'May - October',
    avgDailyBudget: 150,
    latitude: 48.8566,
    longitude: 2.3522,
    rating: 4.9,
    popular: true,
    topAttractions: 'Iconic Tower, Historic Museums, Scenic Walks'
  });

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, tripsRes] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/users'),
        api.get('/admin/trips')
      ]);

      if (statsRes.data?.data) setAnalytics(statsRes.data.data);
      if (usersRes.data?.data) setUsers(usersRes.data.data);
      if (tripsRes.data?.data) setTrips(tripsRes.data.data);
    } catch (err) {
      error('Failed to load administrator data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleUserStatus = async (userId) => {
    try {
      const res = await api.put(`/admin/users/${userId}/toggle-status`);
      setUsers(users.map(u => u.id === userId ? res.data.data : u));
      success('User active status updated');
    } catch (err) {
      error('Failed to update user status');
    }
  };

  const handleUpdateUserRole = async (userId, role) => {
    try {
      const res = await api.put(`/admin/users/${userId}/role`, { role });
      setUsers(users.map(u => u.id === userId ? res.data.data : u));
      success(`User role changed to ${role}`);
    } catch (err) {
      error('Failed to update user role');
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to remove this trip as platform administrator?')) return;
    try {
      await api.delete(`/admin/trips/${tripId}`);
      setTrips(trips.filter(t => t.id !== tripId));
      success('Trip deleted by administrator');
    } catch (err) {
      error('Failed to delete trip');
    }
  };

  const handleCreateDestination = async (e) => {
    e.preventDefault();
    try {
      await api.post('/destinations', destForm);
      success('New destination created and published!');
      setDestModalOpen(false);
      fetchAdminData();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to create destination');
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading Admin Control Center..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" /> Platform Control Center
          </div>
          <h1 className="text-3xl font-black tracking-tight">Administrator Dashboard</h1>
          <p className="text-purple-200/80 text-xs sm:text-sm">
            Manage registered users, monitor trip creation metrics, and curate global destinations.
          </p>
        </div>

        <button
          onClick={() => setDestModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 px-5 py-3 rounded-2xl font-bold text-xs shadow-md hover:scale-105 transition"
        >
          <PlusCircle className="w-4 h-4" /> Add Destination
        </button>
      </div>

      {/* Platform KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Users</span>
          <div className="text-2xl font-black text-purple-700 mt-1">{analytics?.totalUsers || 0}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Platform Trips</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{analytics?.totalTrips || 0}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Active Adventures</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{analytics?.activeTrips || 0}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Curated Destinations</span>
          <div className="text-2xl font-black text-cyan-600 mt-1">{analytics?.totalDestinations || 0}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm col-span-2 lg:col-span-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Expenses Logged</span>
          <div className="text-2xl font-black text-slate-900 mt-1">${analytics?.totalPlatformExpenses?.toLocaleString() || '0.00'}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'users' ? 'bg-purple-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          User Management ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('trips')}
          className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'trips' ? 'bg-purple-600 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Trip Supervision ({trips.length})
        </button>
      </div>

      {/* User Management Table */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Registered Platform Users</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">User</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Preferences</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={
                          u.avatarUrl ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.fullName)}`
                        }
                        alt={u.fullName}
                        className="w-8 h-8 rounded-xl object-cover"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{u.fullName}</div>
                        <div className="text-[11px] text-slate-400">{u.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-bold bg-white"
                      >
                        <option value="ROLE_TRAVELER">ROLE_TRAVELER</option>
                        <option value="ROLE_GROUP_ADMIN">ROLE_GROUP_ADMIN</option>
                        <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleUserStatus(u.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition ${
                          u.enabled
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                      >
                        {u.enabled ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{u.enabled ? 'ACTIVE' : 'DISABLED'}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-slate-500 max-w-xs truncate">
                      {u.travelPreferences || 'Standard Explorer'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-[10px] text-slate-400">ID #{u.id}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Trip Supervision Table */}
      {activeTab === 'trips' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">All Platform Trips</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Trip Title</th>
                  <th className="px-6 py-3.5">Owner</th>
                  <th className="px-6 py-3.5">Destination</th>
                  <th className="px-6 py-3.5">Dates</th>
                  <th className="px-6 py-3.5">Budget</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {trips.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4 font-bold text-slate-900">{t.title}</td>
                    <td className="px-6 py-4 font-medium text-slate-700">{t.ownerName}</td>
                    <td className="px-6 py-4 text-slate-600">{t.destination}</td>
                    <td className="px-6 py-4 text-slate-500">{t.startDate} to {t.endDate}</td>
                    <td className="px-6 py-4 font-bold text-emerald-600">${t.totalBudget}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold uppercase">
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteTrip(t.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                        title="Remove Trip"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Destination Modal */}
      <Modal
        isOpen={destModalOpen}
        onClose={() => setDestModalOpen(false)}
        title="Add New Destination to Catalog"
      >
        <form onSubmit={handleCreateDestination} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Destination Name *</label>
              <input
                type="text"
                required
                value={destForm.name}
                onChange={(e) => setDestForm({ ...destForm, name: e.target.value })}
                placeholder="e.g. Santorini"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Country *</label>
              <input
                type="text"
                required
                value={destForm.country}
                onChange={(e) => setDestForm({ ...destForm, country: e.target.value })}
                placeholder="e.g. Greece"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
            <textarea
              rows={2}
              value={destForm.description}
              onChange={(e) => setDestForm({ ...destForm, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
              <select
                value={destForm.category}
                onChange={(e) => setDestForm({ ...destForm, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              >
                <option value="Cultural">Cultural</option>
                <option value="Beach">Beach</option>
                <option value="Mountain">Mountain</option>
                <option value="Historical">Historical</option>
                <option value="City">City</option>
                <option value="Adventure">Adventure</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Daily Budget ($)</label>
              <input
                type="number"
                value={destForm.avgDailyBudget}
                onChange={(e) => setDestForm({ ...destForm, avgDailyBudget: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Cover Image URL</label>
            <input
              type="url"
              value={destForm.imageUrl}
              onChange={(e) => setDestForm({ ...destForm, imageUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Top Attractions (comma separated)</label>
            <input
              type="text"
              value={destForm.topAttractions}
              onChange={(e) => setDestForm({ ...destForm, topAttractions: e.target.value })}
              placeholder="Oia Sunset, Red Beach, Ancient Thera"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setDestModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow"
            >
              Publish Destination
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboardPage;
