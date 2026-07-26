import { useEffect, useState } from "react";
import { Plus, MapPin, Calendar, Wallet, Eye, Trash2, Pencil, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL"); // ALL, UPCOMING, PAST
  const navigate = useNavigate();

  // Helper to format date: 29 Jul 2026
  const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  // Helper to get status
  const getStatus = (startDate) => {
    const today = new Date();
    const start = new Date(startDate);
    return start > today ? "UPCOMING" : "COMPLETED";
  }

  useEffect(() => {
    fetch("http://localhost:8080/api/trips", {
      headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
    })
      .then(res => res.json())
      .then(data => {
        setTrips(Array.isArray(data) ? data : data.data || data.trips || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if(!confirm("Delete this trip? This cannot be undone.")) return;
    await fetch(`http://localhost:8080/api/trips/${id}`, { 
      method: "DELETE",
      headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
    });
    setTrips(trips.filter(t => t.id !== id));
  }

  const handleShare = (id) => {
    const link = `${window.location.origin}/trips/${id}`;
    navigator.clipboard.writeText(link);
    alert("Trip link copied to clipboard!");
  }

  // Filter trips
  const filteredTrips = trips.filter(trip => {
    if(filter === "ALL") return true;
    return getStatus(trip.startDate) === filter;
  })

  if (loading) return <p className="p-6">Loading trips...</p>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Trips</h1>
        <button 
          onClick={() => navigate("/trips/new")} 
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={18} /> Plan a New Trip
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {["ALL", "UPCOMING", "COMPLETED"].map(tab => (
          <button 
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              filter === tab 
              ? "bg-blue-600 text-white" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredTrips.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-xl bg-white">
          <p className="text-gray-500 mb-4">No trips found</p>
          <button 
            onClick={() => navigate("/trips/new")} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Create your first trip
          </button>
        </div>
      ) : (
        /* Trip Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map(trip => (
            <div key={trip.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-200">
              
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <h2 className="font-bold text-xl text-gray-800 capitalize">
                  {trip.title || trip.destination}
                </h2>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                  getStatus(trip.startDate) === "UPCOMING" 
                  ? "bg-green-100 text-green-700" 
                  : "bg-gray-100 text-gray-700"
                }`}>
                  {getStatus(trip.startDate)}
                </span>
              </div>
              
              {/* Trip Info */}
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-blue-600"/> {trip.destination}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-orange-600"/> {formatDate(trip.startDate)} to {formatDate(trip.endDate)}
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-purple-600"/> {trip.travelers || 1} Travelers
                </div>
                <div className="flex items-center gap-2">
                  <Wallet size={16} className="text-green-600"/> Budget: ₹{trip.budget?.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-3">
                <button 
                  onClick={() => navigate(`/trips/${trip.id}`)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-semibold"
                >
                  <Eye size={16}/> View
                </button>
                <button 
                  onClick={() => navigate(`/trips/${trip.id}/edit`)}
                  className="flex items-center gap-1 text-orange-600 hover:text-orange-800 text-sm font-semibold"
                >
                  <Pencil size={16}/> Edit
                </button>
                <button 
                  onClick={() => handleShare(trip.id)}
                  className="flex items-center gap-1 text-purple-600 hover:text-purple-800 text-sm font-semibold"
                >
                  Share
                </button>
                <button 
                  onClick={() => handleDelete(trip.id)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-semibold"
                >
                  <Trash2 size={16}/> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}