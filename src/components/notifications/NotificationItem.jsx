import { NOTIFICATION_TYPES } from "../../utils/constants";

const ICONS = {
  [NOTIFICATION_TYPES.TRIP_REMINDER]: "🧳",
  [NOTIFICATION_TYPES.ACTIVITY_REMINDER]: "⏰",
  [NOTIFICATION_TYPES.BUDGET_ALERT]: "💸",
  [NOTIFICATION_TYPES.GROUP_INVITATION]: "👥",
  [NOTIFICATION_TYPES.TRAVEL_UPDATE]: "✈️",
  [NOTIFICATION_TYPES.SYSTEM]: "🔔",
};

export default function NotificationItem({
  notification,
  compact = false,
  onMarkRead,
  onDelete,
}) {
  const { id, type, title, message, isRead, createdAt } = notification;

  return (
    <div
      className={`flex gap-3 border-b border-slate-50 px-4 py-3 last:border-0 ${
        isRead ? "bg-white" : "bg-teal-50/40"
      }`}
    >
      <span className="text-lg leading-none">{ICONS[type] || "🔔"}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-900">{title}</p>
        {!compact && (
          <p className="mt-0.5 text-sm text-slate-500">{message}</p>
        )}
        <p className="mt-1 text-xs text-slate-400">
          {new Date(createdAt).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
      {!compact && (
        <div className="flex shrink-0 flex-col items-end gap-1">
          {!isRead && onMarkRead && (
            <button
              onClick={() => onMarkRead(id)}
              className="text-xs font-medium text-teal-600 hover:underline"
            >
              Mark read
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(id)}
              className="text-xs font-medium text-slate-400 hover:text-red-500"
            >
              Remove
            </button>
          )}
        </div>
      )}
    </div>
  );
}