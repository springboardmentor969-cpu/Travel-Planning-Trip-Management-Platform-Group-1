import { formatDate } from "../../utils/constants";

export default function TripTimeline({ events }) {
  if (!events || events.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-slate-400">
        No timeline events yet.
      </p>
    );
  }

  return (
    <ol className="relative ml-3 border-l border-slate-200">
      {events.map((event) => (
        <li key={event.id} className="mb-6 ml-6">
          <span className="absolute -left-[7px] flex h-3.5 w-3.5 items-center justify-center rounded-full bg-teal-600 ring-4 ring-white" />
          <p className="text-xs text-slate-400">{formatDate(event.date)}</p>
          <p className="text-sm font-medium text-slate-900">{event.title}</p>
          {event.description && (
            <p className="text-sm text-slate-500">{event.description}</p>
          )}
        </li>
      ))}
    </ol>
  );
}