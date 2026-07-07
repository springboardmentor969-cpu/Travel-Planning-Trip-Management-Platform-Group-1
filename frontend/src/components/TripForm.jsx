import { Save } from 'lucide-react';
import Button from './Button';
import FormInput from './FormInput';
import { defaultUserId } from '../utils';

const emptyTrip = {
  title: '',
  destination: '',
  startDate: '',
  endDate: '',
  budget: '',
  status: 'PLANNED',
  userId: defaultUserId
};

export default function TripForm({ initialValue, onSubmit, saving }) {
  const trip = { ...emptyTrip, ...initialValue };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onSubmit({
      title: formData.get('title'),
      destination: formData.get('destination'),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
      budget: Number(formData.get('budget')),
      status: formData.get('status'),
      userId: Number(formData.get('userId'))
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
      <FormInput label="Title" name="title" defaultValue={trip.title} required />
      <FormInput label="Destination" name="destination" defaultValue={trip.destination} required />
      <FormInput label="Start date" name="startDate" type="date" defaultValue={trip.startDate} required />
      <FormInput label="End date" name="endDate" type="date" defaultValue={trip.endDate} required />
      <FormInput label="Budget" name="budget" type="number" step="0.01" min="0" defaultValue={trip.budget} required />
      <FormInput label="User ID" name="userId" type="number" min="1" defaultValue={trip.userId} required />
      <label className="block md:col-span-2">
        <span className="mb-1 block text-sm font-medium text-slate-700">Status</span>
        <select
          name="status"
          defaultValue={trip.status}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        >
          <option value="PLANNED">Planned</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
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
