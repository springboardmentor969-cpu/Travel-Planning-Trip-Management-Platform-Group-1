import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Calendar,
  AlertTriangle,
  Users,
  Compass,
  Check
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';

const NotificationsPage = () => {
  const { success, error } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      if (res.data?.data) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      success('All notifications marked as read');
    } catch (err) {
      error('Failed to mark all as read');
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(n => n.id !== id));
      success('Notification dismissed');
    } catch (err) {
      error('Failed to delete notification');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Fetching notifications..." />;
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Bell className="w-7 h-7 text-emerald-600" />
            <span>Notification Center</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Trip reminders, activity schedule alerts, and group collaboration invites
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark All as Read ({unreadCount})</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-100">
        {notifications.length > 0 ? (
          notifications.map((notif) => {
            let iconBg = 'bg-blue-50 text-blue-600';
            let Icon = Bell;

            if (notif.type === 'BUDGET_ALERT') {
              iconBg = 'bg-amber-50 text-amber-600';
              Icon = AlertTriangle;
            } else if (notif.type === 'GROUP_INVITE') {
              iconBg = 'bg-teal-50 text-teal-600';
              Icon = Users;
            } else if (notif.type === 'TRIP_REMINDER' || notif.type === 'ACTIVITY_REMINDER') {
              iconBg = 'bg-emerald-50 text-emerald-600';
              Icon = Calendar;
            }

            return (
              <div
                key={notif.id}
                className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                  !notif.read ? 'bg-emerald-50/40' : 'hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-2xl ${iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{notif.title}</h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                    <span className="text-[10px] text-slate-400 block pt-0.5">
                      {new Date(notif.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {notif.actionUrl && (
                    <Link
                      to={notif.actionUrl}
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs transition"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}

                  {!notif.read && (
                    <button
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg transition"
                      title="Mark as read"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteNotification(notif.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                    title="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center text-xs text-slate-400 space-y-2">
            <Compass className="w-10 h-10 text-slate-300 mx-auto" />
            <p>You have no notifications at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
