import {
  ACTIVITY_TYPE_LABELS,
  ACTIVITY_TYPE_ICONS,
} from "../../utils/constants";

export default function ActivityItem({ activity, onEdit, onDelete }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 p-3 hover:bg-slate-50">
      <span className="mt-0.5 text-lg leading-none">
        {ACTIVITY_TYPE_ICONS[activity.type] || "📍"}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-slate-900">
            {activity.title}
          </p>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">
            {ACTIVITY_TYPE_LABELS[activity.type] || activity.type}
          </span>
        </div>
        {activity.place && (
          <p className="text-xs text-slate-500">{activity.place}</p>
        )}
        {(activity.startTime || activity.endTime) && (
          <p className="text-xs text-slate-400">
            {activity.startTime}
            {activity.endTime ? ` – ${activity.endTime}` : ""}
          </p>
        )}
        {activity.notes && (
          <p className="mt-1 text-xs text-slate-500">{activity.notes}</p>
        )}
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          onClick={() => onEdit(activity)}
          className="text-xs font-medium text-teal-600 hover:underline"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(activity)}
          className="text-xs font-medium text-slate-400 hover:text-red-500"
        >
          Remove
        </button>
      </div>
    </div>
  );
}