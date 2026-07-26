import { formatDate } from "../../utils/constants";
import ActivityItem from "./ActivityItem";

export default function DayCard({
  day,
  onAddActivity,
  onEditActivity,
  onDeleteActivity,
  onRemoveDay,
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-teal-600">
            Day {day.dayNumber}
          </p>
          <p className="text-sm text-slate-500">{formatDate(day.date)}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onAddActivity(day)}
            className="text-xs font-medium text-teal-600 hover:underline"
          >
            + Add activity
          </button>
          <button
            onClick={() => onRemoveDay(day)}
            className="text-xs font-medium text-slate-400 hover:text-red-500"
          >
            Remove day
          </button>
        </div>
      </div>

      {(!day.activities || day.activities.length === 0) && (
        <p className="rounded-xl border border-dashed border-slate-200 py-6 text-center text-sm text-slate-400">
          No activities planned for this day yet.
        </p>
      )}

      <div className="space-y-2">
        {(day.activities || []).map((activity) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            onEdit={(a) => onEditActivity(day, a)}
            onDelete={(a) => onDeleteActivity(day, a)}
          />
        ))}
      </div>
    </div>
  );
}