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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Create New Trip</h1>
      
      <form onSubmit={handleSubmit} className="bg-white border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Title */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FileText size={16} /> Title
            </label>
            <input 
              type="text" 
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Goa Summer Trip"
              className="w-full border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Destination */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <MapPin size={16} /> Destination
            </label>
            <input 
              type="text" 
              name="destination"
              value={form.destination}
              onChange={handleChange}
              placeholder="e.g. Goa"
              className="w-full border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Calendar size={16} /> Start Date
            </label>
            <input 
              type="date" 
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* End Date */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Calendar size={16} /> End Date
            </label>
            <input 
              type="date" 
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Budget */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Wallet size={16} /> Budget ₹
            </label>
            <input 
              type="number" 
              name="budget"
              value={form.budget}
              onChange={handleChange}
              placeholder="50000"
              className="w-full border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Travelers - NEW FIELD */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Users size={16} /> Travelers
            </label>
            <input 
              type="number" 
              name="travelers"
              value={form.travelers}
              onChange={handleChange}
              min="1"
              className="w-full border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

        </div>

        {/* Status */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Status</label>
          <select 
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="PLANNED">Planned</option>
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        {/* User ID - Hide this later, get from auth */}
        <input type="hidden" name="userId" value={form.userId} />

        {/* Save Button */}
        <button 
          type="submit" 
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-gray-400"
        >
          <Save size={18} /> {loading ? "Saving..." : "Save Trip"}
        </button>

      </form>
    </div>
  );
}
