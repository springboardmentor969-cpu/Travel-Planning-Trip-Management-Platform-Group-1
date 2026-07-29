import { useState } from "react";
import { Save, MapPin, Calendar, Wallet, Users, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CreateTrip() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    travelers: 1,
    status: "PLANNED",
    userId: 1 // TODO: get from logged in user
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/trips", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({
          ...form,
          budget: Number(form.budget),
          travelers: Number(form.travelers)
        })
      });

      if(res.ok) {
        alert("Trip created successfully!");
        navigate("/trips");
      } else {
        alert("Failed to create trip");
      }
    } catch(err) {
      console.error(err);
      alert("Error creating trip");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full bg-white/5 border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition duration-300 [color-scheme:dark]"
  const labelClass = "flex items-center gap-2 text-sm font-semibold text-white/80 mb-2"

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <h1 className="font-heading text-4xl font-bold text-white mb-2">Create New Trip</h1>
      <p className="text-white/60 mb-8">Plan your next luxury adventure</p>
      
      <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Title */}
            <div>
              <label className={labelClass}>
                <FileText size={16} className="text-amber-500" /> Title
              </label>
              <input 
                type="text" 
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Goa Summer Trip"
                className={inputClass}
                required
              />
            </div>

            {/* Destination */}
            <div>
              <label className={labelClass}>
                <MapPin size={16} className="text-amber-500" /> Destination
              </label>
              <input 
                type="text" 
                name="destination"
                value={form.destination}
                onChange={handleChange}
                placeholder="e.g. Goa"
                className={inputClass}
                required
              />
            </div>

            {/* Start Date */}
            <div>
              <label className={labelClass}>
                <Calendar size={16} className="text-amber-500" /> Start Date
              </label>
              <input 
                type="date" 
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            {/* End Date */}
            <div>
              <label className={labelClass}>
                <Calendar size={16} className="text-amber-500" /> End Date
              </label>
              <input 
                type="date" 
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            {/* Budget */}
            <div>
              <label className={labelClass}>
                <Wallet size={16} className="text-amber-500" /> Budget ₹
              </label>
              <input 
                type="number" 
                name="budget"
                value={form.budget}
                onChange={handleChange}
                placeholder="50000"
                className={inputClass}
                required
              />
            </div>

            {/* Travelers */}
            <div>
              <label className={labelClass}>
                <Users size={16} className="text-amber-500" /> Travelers
              </label>
              <input 
                type="number" 
                name="travelers"
                value={form.travelers}
                onChange={handleChange}
                min="1"
                className={inputClass}
                required
              />
            </div>

          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-semibold text-white/80 mb-2 block">Status</label>
            <select 
              name="status"
              value={form.status}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="PLANNED" className="bg-[#0B1224] text-white">Planned</option>
              <option value="ONGOING" className="bg-[#0B1224] text-white">Ongoing</option>
              <option value="COMPLETED" className="bg-[#0B1224] text-white">Completed</option>
            </select>
          </div>

          {/* User ID - Hide this later, get from auth */}
          <input type="hidden" name="userId" value={form.userId} />

          {/* Save Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-teal-500 text-[#050A18] px-8 py-3.5 rounded-2xl font-bold shadow-2xl shadow-amber-500/30 hover:scale-105 hover:shadow-amber-500/50 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Save size={18} /> {loading ? "Saving..." : "Save Trip"}
          </button>

        </form>
      </div>
    </div>
  );
}