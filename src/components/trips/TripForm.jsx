import { useState } from "react";
import FormField from "../FormField";
import { TRIP_STATUS, TRIP_STATUS_LABELS } from "../../utils/constants";

const emptyForm = {
  destination: "",
  startDate: "",
  endDate: "",
  budget: "",
  travelerCount: 1,
  status: TRIP_STATUS.PLANNING,
};

export default function TripForm({ initialValues, onSubmit, submitLabel }) {
  const [form, setForm] = useState({ ...emptyForm, ...initialValues });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!form.destination) next.destination = "Destination is required.";
    if (!form.startDate) next.startDate = "Start date is required.";
    if (!form.endDate) next.endDate = "End date is required.";
    if (
      form.startDate &&
      form.endDate &&
      new Date(form.endDate) < new Date(form.startDate)
    ) {
      next.endDate = "End date can't be before the start date.";
    }
    if (!form.budget || Number(form.budget) <= 0)
      next.budget = "Enter a budget greater than 0.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...form,
        budget: Number(form.budget),
        travelerCount: Number(form.travelerCount),
      });
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || "Could not save this trip."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-1">
      {submitError && (
        <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {submitError}
        </div>
      )}

      <FormField
        label="Destination"
        name="destination"
        value={form.destination}
        onChange={handleChange}
        error={errors.destination}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Start date"
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          error={errors.startDate}
        />
        <FormField
          label="End date"
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          error={errors.endDate}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Budget (₹)"
          type="number"
          name="budget"
          value={form.budget}
          onChange={handleChange}
          error={errors.budget}
        />
        <FormField
          label="Travelers"
          type="number"
          name="travelerCount"
          value={form.travelerCount}
          onChange={handleChange}
          required={false}
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Status
        </label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500"
        >
          {Object.values(TRIP_STATUS).map((status) => (
            <option key={status} value={status}>
              {TRIP_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-teal-600 py-2 text-sm font-medium text-white transition hover:bg-teal-700 disabled:opacity-60"
      >
        {isSubmitting ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}