import { Save } from 'lucide-react';
import Button from './Button';
import FormInput from './FormInput';
import { defaultUserId } from '../utils';

const emptyTrip = {
  title: '',
  destination: '',
  start_date: '',
  end_date: '',
  budget: '',
  status: 'PLANNED',
  user_id: defaultUserId
};

export default function TripForm({ initialValue, onSubmit, saving }) {
  // Merge defaults + handle both camelCase and snake_case from API
  const trip = { 
    ...emptyTrip, 
    ...initialValue,
    start_date: initialValue?.start_date || initialValue?.startDate || '',
    end_date: initialValue?.end_date || initialValue?.endDate || '',
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
      budget: Number(formData.get('budget')),
      status: formData.get('status'),
    };

    // only send user_id on create
    if (!initialValue?.id) {
      payload.user_id = Number(formData.get('user_id'));
    }

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
      <FormInput label="Title" name="title" defaultValue={trip.title} required />
      <FormInput label="Destination" name="destination" defaultValue={trip.destination} required />
      <FormInput label="Start date" name="start_date" type="date" defaultValue={trip.start_date} required />
      <FormInput label="End date" name="end_date" type="date" defaultValue={trip.end_date} required />
      <FormInput label="Budget" name="budget" type="number" step="0.01" min="0" defaultValue={trip.budget} required />
      
      {/* Hide User ID on edit */}
      {!initialValue?.id && (
        <FormInput label="User ID" name="user_id" type="number" min="1" defaultValue={trip.user_id} required />
      )}

      <label className="block md:col-span-2">
        <span className="mb-1 block text-sm font-medium text-slate-700">Status</span>
        <select
          name="status"
          defaultValue={trip.status}
          className="w-full rounded-lg border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        >
          <option value="planned">Planned</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </label>
      <div className="md:col-span-2">
        <Button type="submit" disabled={saving}>
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save trip'}
        </Button>
      </div>
    </form>
  );
}