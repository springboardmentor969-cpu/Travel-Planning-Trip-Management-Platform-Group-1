import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import authApi from "../api/authApi";
import FormField from "../components/FormField";
import { ROLE_LABELS } from "../utils/roles";

export default function Profile() {
  const { user, refreshProfile } = useAuth();

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    travelPreferences: "",
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileMessage, setProfileMessage] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordMessage, setPasswordMessage] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        email: user.email || "",
        travelPreferences: user.travelPreferences || "",
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setProfileErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handlePasswordChange = (e) => {
    setPasswordForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setPasswordErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMessage("");

    const next = {};
    if (!profileForm.name) next.name = "Full name is required.";
    setProfileErrors(next);
    if (Object.keys(next).length > 0) return;

    setIsSavingProfile(true);
    try {
      await authApi.updateProfile(profileForm);
      await refreshProfile();
      setProfileMessage("Profile updated successfully.");
    } catch (err) {
      setProfileMessage(
        err.response?.data?.message || "Could not update your profile."
      );
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage("");

    const next = {};
    if (!passwordForm.currentPassword)
      next.currentPassword = "Current password is required.";
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 8)
      next.newPassword = "New password must be at least 8 characters.";
    if (passwordForm.confirmNewPassword !== passwordForm.newPassword)
      next.confirmNewPassword = "Passwords do not match.";
    setPasswordErrors(next);
    if (Object.keys(next).length > 0) return;

    setIsSavingPassword(true);
    try {
      await authApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordMessage("Password changed successfully.");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err) {
      setPasswordMessage(
        err.response?.data?.message || "Could not change your password."
      );
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Banner with Picture */}
      <div className="relative h-60 w-full overflow-hidden sm:h-72">
        <img
          src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1920&q=80"
          alt="Profile Header"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-teal-900/40" />
      </div>

      <div className="mx-auto max-w-2xl px-4">
        {/* Floating Avatar Card with glowing gradient border */}
        <div className="-mt-16 mb-8 flex items-center gap-5 rounded-3xl border border-slate-200/80 bg-white/95 p-5 shadow-xl backdrop-blur-md">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 via-emerald-500 to-teal-700 text-2xl font-bold text-white shadow-md ring-4 ring-white">
            {user.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {user.name}
            </h1>
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">
              {ROLE_LABELS[user.role] || user.role} · {user.email}
            </p>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4">
          <Link
            to="/profile/travel-history"
            className="flex items-center gap-3 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-xl">📜</span>
            <div>
              <span className="block text-sm font-bold text-slate-900">Travel History</span>
              <span className="text-xs text-slate-500">Past completed trips</span>
            </div>
          </Link>
          <Link
            to="/profile/favorite-destinations"
            className="flex items-center gap-3 rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50/50 to-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-xl">⭐</span>
            <div>
              <span className="block text-sm font-bold text-slate-900">Favorites</span>
              <span className="text-xs text-slate-500">Saved destinations</span>
            </div>
          </Link>
        </div>

        <div className="pb-12 space-y-8">
          <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              👤 Personal Details
            </h2>
            {profileMessage && (
              <div className="mb-4 rounded-xl bg-teal-50 px-3.5 py-2 text-xs font-medium text-teal-700 border border-teal-200">
                {profileMessage}
              </div>
            )}
            <form onSubmit={handleProfileSubmit} noValidate>
              <FormField
                label="Full name"
                name="name"
                value={profileForm.name}
                onChange={handleProfileChange}
                error={profileErrors.name}
              />
              <FormField
                label="Email address"
                type="email"
                name="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                error={profileErrors.email}
                required={false}
              />
              <div className="mb-5">
                <label
                  htmlFor="travelPreferences"
                  className="mb-1.5 block text-xs font-medium text-slate-600"
                >
                  Travel Preferences
                </label>
                <textarea
                  id="travelPreferences"
                  name="travelPreferences"
                  value={profileForm.travelPreferences}
                  onChange={handleProfileChange}
                  rows={3}
                  placeholder="e.g. beach trips, luxury stays, budget travel, mountain trekking"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <button
                type="submit"
                disabled={isSavingProfile}
                className="rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:from-teal-700 hover:to-emerald-700 disabled:opacity-60"
              >
                {isSavingProfile ? "Saving…" : "Save changes"}
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              🔒 Security & Password
            </h2>
            {passwordMessage && (
              <div className="mb-4 rounded-xl bg-teal-50 px-3.5 py-2 text-xs font-medium text-teal-700 border border-teal-200">
                {passwordMessage}
              </div>
            )}
            <form onSubmit={handlePasswordSubmit} noValidate>
              <FormField
                label="Current password"
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                error={passwordErrors.currentPassword}
                autoComplete="current-password"
              />
              <FormField
                label="New password"
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                error={passwordErrors.newPassword}
                autoComplete="new-password"
              />
              <FormField
                label="Confirm new password"
                type="password"
                name="confirmNewPassword"
                value={passwordForm.confirmNewPassword}
                onChange={handlePasswordChange}
                error={passwordErrors.confirmNewPassword}
                autoComplete="new-password"
              />
              <button
                type="submit"
                disabled={isSavingPassword}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 disabled:opacity-60"
              >
                {isSavingPassword ? "Updating…" : "Update password"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}