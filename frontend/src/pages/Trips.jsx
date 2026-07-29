import { useEffect, useState } from "react";
import { Plus, MapPin, Calendar, Wallet, Eye, Trash2, Pencil, Users, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const navigate = useNavigate();

  const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

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

  const filteredTrips = trips.filter(trip => {
    if(filter === "ALL") return true;
    return getStatus(trip.startDate) === filter;
  })

  if (loading) return <p className="p-6 text-white/70">Loading trips...</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">My Trips</h1>
        <button 
          onClick={() => navigate("/trips/new")} 
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-purple-500/30 hover:scale-105 transition-all duration-300"
        >
          <Plus size={18} /> Plan a New Trip
        </button>
      </div>

      {/* Filter Tabs - Bright Blue Active */}
      <div className="flex gap-3">
        {["ALL", "UPCOMING", "COMPLETED"].map(tab => (
          <button 
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition ${
              filter === tab 
              ? "bg-[#00BFFF] text-white"  // bright blue from screenshot
              : "bg-black/30 text-white/70 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Trip Cards Grid - Dark Glass */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTrips.map(trip => (
          <div key={trip.id} className="bg-[#0A1A3A]/50 backdrop-blur-xl border-white/10 rounded-2xl p-6">
            
            {/* Status Badge - White Pill */}
            <div className="flex justify-center mb-4">
              <span className="text-xs px-5 py-1.5 rounded-full font-bold bg-white text-slate-700">
                {getStatus(trip.startDate)}
              </span>
            </div>
              
              {/* Trip Info - Colored Icons */}
              <div className="space-y-3 text-sm mb-5">
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-cyan-400"/> 
                  <span className="text-white/90 font-medium">{trip.destination}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-red-400"/> 
                  <span className="text-white/90 font-medium">{formatDate(trip.startDate)} to {formatDate(trip.endDate)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users size={18} className="text-purple-400"/> 
                  <span className="text-white/90 font-medium">{trip.travelers || 1} Travelers</span>
                </div>
                <div className="flex items-center gap-3">
                  <Wallet size={18} className="text-green-400"/> 
                  <span className="text-white/90 font-medium">Budget: ₹{trip.budget?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Divider */}
              <hr className="border-white/10 mb-4" />

              {/* Actions - Exact colors from screenshot */}
              <div className="flex justify-between items-center">
                <button 
                  onClick={() => navigate(`/trips/${trip.id}`)}
                  className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 text-sm font-bold"
                >
                  <Eye size={16}/> View
                </button>
                <button 
                  onClick={() => navigate(`/trips/${trip.id}/edit`)}
                  className="flex items-center gap-1.5 text-orange-400 hover:text-orange-300 text-sm font-bold"
                >
                  <Pencil size={16}/> Edit
                </button>
                <button 
                  onClick={() => handleShare(trip.id)}
                  className="flex items-center gap-1.5 text-white hover:text-white/80 text-sm font-bold"
                >
                  <Share2 size={16}/> Share
                </button>
                <button 
                  onClick={() => handleDelete(trip.id)}
                  className="flex items-center gap-1.5 text-red-400 hover:text-red-300 text-sm font-bold"
                >
                  <Trash2 size={16}/> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
}