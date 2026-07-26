import { useState } from "react";
import FormField from "../FormField";
import { ACTIVITY_TYPES, ACTIVITY_TYPE_LABELS } from "../../utils/constants";

const emptyActivity = {
  title: "",
  type: ACTIVITY_TYPES[0],
  place: "",
  startTime: "",
  endTime: "",
  notes: "",
  reminder: false,
};

export default function ActivityFormModal({
  initialValues,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState({ ...emptyActivity, ...initialValues });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) {
      setErrors({ title: "Activity title is required." });
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">
            {initialValues ? "Edit activity" : "Add activity"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <FormField
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            error={errors.title}
          />

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Type
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500"
            >
              {ACTIVITY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {ACTIVITY_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </div>

          <FormField
            label="Place"
            name="place"
            value={form.place}
            onChange={handleChange}
            required={false}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Start time"
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              required={false}
            />
            <FormField
              label="End time"
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              required={false}
            />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Notes
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={2}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <label className="mb-5 flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              name="reminder"
              checked={form.reminder}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            Remind me before this activity
          </label>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-teal-600 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-60"
            >
              {isSubmitting ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}