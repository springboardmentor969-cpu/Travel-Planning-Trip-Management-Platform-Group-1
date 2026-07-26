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
      setProfileMessage("Profile updated.");
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
      setPasswordMessage("Password changed.");
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
    <div className="bg-slate-50">
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-pink-900/40 to-rose-900/30" />
      </div>

      <div className="mx-auto max-w-2xl px-4">
        {/* Floating avatar card, overlapping the hero */}
        <div className="-mt-16 mb-8 flex items-center gap-4 rounded-2xl bg-white p-5 shadow-lg">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-600 text-2xl font-semibold text-white shadow">
            {user.name?.charAt(0)?.toUpperCase()}
          </span>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              {user.name}
            </h1>
            <p className="text-sm text-slate-500">
              {ROLE_LABELS[user.role] || user.role}
            </p>
          </div>
        </div>

        <div className="mb-8 flex gap-3">
          <Link
            to="/profile/travel-history"
            className="flex-1 rounded-xl bg-white p-4 text-center shadow-sm transition hover:shadow-md"
          >
            <span className="mb-1 block text-2xl">📜</span>
            <span className="text-sm font-medium text-slate-700">Travel history</span>
          </Link>
          <Link
            to="/profile/favorite-destinations"
            className="flex-1 rounded-xl bg-white p-4 text-center shadow-sm transition hover:shadow-md"
          >
            <span className="mb-1 block text-2xl">⭐</span>
            <span className="text-sm font-medium text-slate-700">Favorites</span>
          </Link>
        </div>

        <div className="pb-10">
          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-slate-900">
              Profile details
            </h2>
            {profileMessage && (
              <div className="mb-4 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
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
                label="Email"
                type="email"
                name="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                error={profileErrors.email}
                required={false}
              />
              <div className="mb-4">
                <label
                  htmlFor="travelPreferences"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Travel preferences
                </label>
                <textarea
                  id="travelPreferences"
                  name="travelPreferences"
                  value={profileForm.travelPreferences}
                  onChange={handleProfileChange}
                  rows={3}
                  placeholder="e.g. beach trips, budget travel, hiking"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <button
                type="submit"
                disabled={isSavingProfile}
                className="rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:from-teal-700 hover:to-emerald-700 disabled:opacity-60"
              >
                {isSavingProfile ? "Saving…" : "Save changes"}
              </button>
            </form>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-slate-900">
              Change password
            </h2>
            {passwordMessage && (
              <div className="mb-4 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
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
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
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