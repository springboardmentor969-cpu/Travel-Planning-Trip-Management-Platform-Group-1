import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  Calendar,
  DollarSign,
  Users,
  MapPin,
  Trash2,
  Share2,
  ExternalLink,
  Sparkles,
  Compass,
  CheckCircle2,
  Clock
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

const STATUS_FILTERS = ['ALL', 'PLANNED', 'ONGOING', 'COMPLETED', 'CANCELLED'];

const MyTripsPage = () => {
  const { success, error } = useToast();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deleteModalTrip, setDeleteModalTrip] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const res = await api.get('/trips');
      if (res.data?.data) {
        setTrips(res.data.data);
      }
    } catch (err) {
      error('Failed to load your trips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDeleteTrip = async () => {
    if (!deleteModalTrip) return;
    setDeleting(true);
    try {
      await api.delete(`/trips/${deleteModalTrip.id}`);
      success('Trip deleted successfully');
      setTrips(trips.filter((t) => t.id !== deleteModalTrip.id));
      setDeleteModalTrip(null);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete trip');
    } finally {
      setDeleting(false);
    }
  };

  const handleCopyShareLink = (shareCode) => {
    const url = `${window.location.origin}/trips/share/${shareCode}`;
    navigator.clipboard.writeText(url);
    success('Shareable trip link copied to clipboard!');
  };

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || trip.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Travel Itineraries
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your past, ongoing, and upcoming adventures
          </p>
        </div>

        <Link
          to="/trips/new"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-md transition hover:scale-105"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Trip</span>
        </Link>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search trips by name or destination..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                statusFilter === status
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Trips Grid */}
      {loading ? (
        <LoadingSpinner text="Fetching your trips..." />
      ) : filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => {
            let statusBadgeColor = 'bg-emerald-100 text-emerald-800';
            if (trip.status === 'ONGOING') statusBadgeColor = 'bg-blue-100 text-blue-800 animate-pulse';
            if (trip.status === 'COMPLETED') statusBadgeColor = 'bg-slate-100 text-slate-700';
            if (trip.status === 'CANCELLED') statusBadgeColor = 'bg-rose-100 text-rose-800';

            return (
              <div
                key={trip.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={
                      trip.coverImageUrl ||
                      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80'
                    }
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase shadow-sm ${statusBadgeColor}`}>
                      {trip.status}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopyShareLink(trip.shareCode)}
                    title="Copy Public Share Link"
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-emerald-600 transition shadow-sm"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{trip.destination}</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition line-clamp-1">
                      {trip.title}
                    </h3>

                    {trip.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {trip.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-2 border-t border-b border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{trip.startDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-bold text-slate-800">${trip.totalBudget}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => setDeleteModalTrip(trip)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                      title="Delete Trip"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <Link
                      to={`/trips/${trip.id}`}
                      className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow transition"
                    >
                      <span>View Details</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-md mx-auto space-y-4">
          <Compass className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No trips found</h3>
          <p className="text-xs text-slate-500">
            {searchQuery || statusFilter !== 'ALL'
              ? 'Try clearing your search or status filter.'
              : "You haven't created any trips yet. Let's create your first itinerary!"}
          </p>
          <Link
            to="/trips/new"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow hover:bg-emerald-700 transition"
          >
            <PlusCircle className="w-4 h-4" /> Create Trip
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteModalTrip}
        onClose={() => setDeleteModalTrip(null)}
        title="Confirm Trip Deletion"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            Are you sure you want to delete <span className="font-bold text-slate-900">"{deleteModalTrip?.title}"</span>?
            This will permanently remove the day-wise itinerary, scheduled activities, budget allocations, and associated records.
          </p>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => setDeleteModalTrip(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteTrip}
              disabled={deleting}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow transition disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Delete Trip'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyTripsPage;
