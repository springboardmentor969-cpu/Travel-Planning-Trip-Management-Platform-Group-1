import { useEffect, useState } from "react";
import itineraryApi from "../../api/itineraryApi";
import DayCard from "../../components/itinerary/DayCard";
import ActivityFormModal from "../../components/itinerary/ActivityFormModal";

export default function ItineraryPlanner({ tripId }) {
  const [days, setDays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState(null);

  const loadItinerary = async () => {
    setIsLoading(true);
    try {
      const data = await itineraryApi.getItinerary(tripId);
      setDays(data);
    } catch (err) {
      setDays([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadItinerary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  const handleAddDay = async () => {
    const nextDayNumber = days.length + 1;
    const lastDate = days[days.length - 1]?.date;
    const nextDate = lastDate
      ? new Date(new Date(lastDate).getTime() + 86400000)
          .toISOString()
          .slice(0, 10)
      : new Date().toISOString().slice(0, 10);

    const newDay = await itineraryApi.addDay(tripId, {
      dayNumber: nextDayNumber,
      date: nextDate,
    });
    setDays((prev) => [...prev, { ...newDay, activities: [] }]);
  };

  const handleRemoveDay = async (day) => {
    if (!window.confirm(`Remove Day ${day.dayNumber} and its activities?`))
      return;
    await itineraryApi.removeDay(tripId, day.id);
    setDays((prev) => prev.filter((d) => d.id !== day.id));
  };

  const handleActivitySubmit = async (form) => {
    const { day, activity } = modalState;
    if (activity) {
      const updated = await itineraryApi.updateActivity(
        tripId,
        activity.id,
        form
      );
      setDays((prev) =>
        prev.map((d) =>
          d.id === day.id
            ? {
                ...d,
                activities: d.activities.map((a) =>
                  a.id === activity.id ? updated : a
                ),
              }
            : d
        )
      );
    } else {
      const created = await itineraryApi.addActivity(tripId, day.id, form);
      setDays((prev) =>
        prev.map((d) =>
          d.id === day.id
            ? { ...d, activities: [...(d.activities || []), created] }
            : d
        )
      );
    }
  };

  const handleDeleteActivity = async (day, activity) => {
    if (!window.confirm(`Remove "${activity.title}"?`)) return;
    await itineraryApi.deleteActivity(tripId, activity.id);
    setDays((prev) =>
      prev.map((d) =>
        d.id === day.id
          ? { ...d, activities: d.activities.filter((a) => a.id !== activity.id) }
          : d
      )
    );
  };

  if (isLoading) {
    return (
      <p className="py-10 text-center text-sm text-slate-400">
        Loading itinerary…
      </p>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 px-5 py-4">
        <div>
          <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
            🗓️ Day-wise itinerary
          </h2>
          <p className="text-xs text-slate-500">
            {days.length} day{days.length !== 1 ? "s" : ""} planned
          </p>
        </div>
        <button
          onClick={handleAddDay}
          className="rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-teal-700"
        >
          + Add day
        </button>
      </div>

      {days.length === 0 && (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 py-14 text-center">
          <span className="mb-2 text-3xl">✈️</span>
          <p className="text-sm text-slate-400">
            Start building your itinerary by adding Day 1.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {days.map((day) => (
          <DayCard
            key={day.id}
            day={day}
            onAddActivity={(d) => setModalState({ day: d })}
            onEditActivity={(d, activity) => setModalState({ day: d, activity })}
            onDeleteActivity={handleDeleteActivity}
            onRemoveDay={handleRemoveDay}
          />
        ))}
      </div>

      {modalState && (
        <ActivityFormModal
          initialValues={modalState.activity}
          onClose={() => setModalState(null)}
          onSubmit={handleActivitySubmit}
        />
      )}
    </div>
  );
}