import { Save } from 'lucide-react';
import Button from './Button';
import FormInput from './FormInput';
import { defaultUserId } from '../utils';

const emptyTrip = {
  title: '',
  destination: '',
  start_date: '',
  end_date: '',
  travelers: 1,
  budget: '',
  status: 'planned',
  user_id: defaultUserId
};

// Dark theme classes
const inputClass = "w-full bg-white/5 border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50 [color-scheme:dark]";
const labelClass = "block text-sm font-semibold text-white/80 mb-2";

export default function TripForm({ initialValue, onSubmit, saving }) {
  const trip = { 
    ...emptyTrip, 
    ...initialValue,
    start_date: initialValue?.start_date || initialValue?.startDate || '',
    end_date: initialValue?.end_date || initialValue?.endDate || '',
    travelers: initialValue?.travelers || 1,
    status: initialValue?.status?.toLowerCase() || 'planned',
    user_id: initialValue?.user_id || initialValue?.userId || defaultUserId,
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const payload = {
      title: formData.get('title'),
      destination: formData.get('destination'),
      start_date: formData.get('start_date'),
      end_date: formData.get('end_date'),
      travelers: Number(formData.get('travelers')),
      budget: Number(formData.get('budget')),
      status: formData.get('status'),
    };

    payload.user_id = Number(formData.get('user_id') || trip.user_id || defaultUserId);
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
      {/* Title */}
      <div>
        <label className={labelClass}>Trip Title</label>
        <input name="title" defaultValue={trip.title} required className={inputClass} placeholder="Goa Vacation" />
      </div>

      {/* Destination */}
      <div>
        <label className={labelClass}>Destination</label>
        <input name="destination" defaultValue={trip.destination} required className={inputClass} placeholder="Goa, India" />
      </div>

      {/* Start date */}
      <div>
        <label className={labelClass}>Start Date</label>
        <input name="start_date" type="date" defaultValue={trip.start_date} required className={inputClass} />
      </div>

      {/* End date */}
      <div>
        <label className={labelClass}>End Date</label>
        <input name="end_date" type="date" defaultValue={trip.end_date} required className={inputClass} />
      </div>

      {/* Travelers */}
      <div>
        <label className={labelClass}>Travelers</label>
        <input name="travelers" type="number" min="1" defaultValue={trip.travelers} required className={inputClass} />
      </div>

      {/* Budget */}
      <div>
        <label className={labelClass}>Budget ₹</label>
        <input name="budget" type="number" step="0.01" min="0" defaultValue={trip.budget} required className={inputClass} placeholder="25000" />
      </div>
      
      {/* User ID - only for new trip */}
      {!initialValue?.id && (
        <div>
          <label className={labelClass}>User ID</label>
          <input name="user_id" type="number" min="1" defaultValue={trip.user_id} required className={inputClass} />
        </div>
      )}

      {/* Status */}
      <div className="md:col-span-2">
        <label className="block text-sm font-semibold text-white/80 mb-2">Status</label>
        <select
          name="status"
          defaultValue={trip.status}
          className={inputClass}
        >
          <option value="planned">Planned</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Submit Button */}
      <div className="md:col-span-2 pt-2">
        <button 
          type="submit" 
          disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-teal-500 text-[#050A18] px-8 py-3.5 rounded-2xl font-bold shadow-2xl shadow-amber-500/30 hover:scale-105 hover:shadow-amber-500/50 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save trip'}
        </button>
      </div>
    </form>
  );
}