import { useEffect, useState } from "react";
import notificationApi from "../../api/notificationApi";
import groupApi from "../../api/groupApi";
import NotificationItem from "../../components/notifications/NotificationItem";

const PREFERENCE_FIELDS = [
  { key: "tripReminders", label: "Trip reminders" },
  { key: "activityReminders", label: "Activity reminders" },
  { key: "budgetAlerts", label: "Budget alerts" },
  { key: "groupInvitations", label: "Group invitations" },
  { key: "travelUpdates", label: "Travel updates" },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [preferences, setPreferences] = useState(null);
  const [filter, setFilter] = useState("all");

  const loadAll = async () => {
    setIsLoading(true);
    try {
      const [list, prefs, pendingInvites] = await Promise.all([
        notificationApi.getNotifications(),
        notificationApi.getPreferences().catch(() => null),
        groupApi.getPendingInvitations().catch(() => []),
      ]);
      setNotifications(list);
      setPreferences(prefs);
      setInvitations(pendingInvites);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleAcceptInvite = async (invitationId) => {
    try {
      await groupApi.acceptInvitation(invitationId);
      alert("Invitation accepted! You are now a trip member.");
      await loadAll();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to accept invitation.");
    }
  };

  const handleRejectInvite = async (invitationId) => {
    try {
      await groupApi.rejectInvitation(invitationId);
      setInvitations((prev) => prev.filter((i) => i.id !== invitationId));
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to reject invitation.");
    }
  };

  const handleMarkRead = async (id) => {
    await notificationApi.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleDelete = async (id) => {
    await notificationApi.deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handlePreferenceToggle = async (key) => {
    const next = { ...preferences, [key]: !preferences[key] };
    setPreferences(next);
    await notificationApi.updatePreferences(next);
  };

  const visible = notifications.filter((n) =>
    filter === "unread" ? !n.isRead : true
  );

  return (
    <div>
      {/* Header banner */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 text-white">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <h1 className="text-2xl font-semibold sm:text-3xl">🔔 Notifications & Invites</h1>
          <p className="mt-1 text-violet-100">
            Trip reminders, group invitations, budget alerts, and updates.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
        {/* Pending Group Invitations Section */}
        {invitations.length > 0 && (
          <div className="rounded-2xl border border-purple-200 bg-purple-50/60 p-5 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-purple-900">
              <span>👥</span> Pending Trip Invitations ({invitations.length})
            </h2>
            <div className="space-y-3">
              {invitations.map((invite) => (
                <div
                  key={invite.id}
                  className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      You were invited to join a trip!
                    </p>
                    <p className="text-xs text-slate-500">
                      Role: <span className="font-medium text-purple-700">{invite.role}</span> · Email: {invite.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAcceptInvite(invite.id)}
                      className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 transition"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectInvite(invite.id)}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="mb-3 flex gap-2">
              {["all", "unread"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition ${
                    filter === f
                      ? "bg-violet-600 text-white"
                      : "bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              {isLoading && (
                <p className="px-4 py-10 text-center text-sm text-slate-400">
                  Loading notifications…
                </p>
              )}
              {!isLoading && visible.length === 0 && (
                <div className="flex flex-col items-center px-4 py-14 text-center">
                  <span className="mb-2 text-3xl">✅</span>
                  <p className="text-sm text-slate-400">
                    You're all caught up.
                  </p>
                </div>
              )}
              {!isLoading &&
                visible.map((n) => (
                  <NotificationItem
                    key={n.id}
                    notification={n}
                    onMarkRead={handleMarkRead}
                    onDelete={handleDelete}
                  />
                ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">
              Preferences
            </h2>
            {!preferences && <p className="text-sm text-slate-400">Loading…</p>}
            {preferences && (
              <div className="space-y-3">
                {PREFERENCE_FIELDS.map((field) => (
                  <label
                    key={field.key}
                    className="flex items-center justify-between text-sm text-slate-700"
                  >
                    {field.label}
                    <input
                      type="checkbox"
                      checked={!!preferences[field.key]}
                      onChange={() => handlePreferenceToggle(field.key)}
                      className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                    />
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}