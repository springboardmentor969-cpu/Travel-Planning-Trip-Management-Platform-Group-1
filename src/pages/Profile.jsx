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
    <div>
      {/* Header banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-rose-500 to-pink-700 text-white">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1600&q=80"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative mx-auto max-w-2xl px-4 py-10">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl font-semibold text-pink-700 shadow">
              {user.name?.charAt(0)?.toUpperCase()}
            </span>
            <div>
              <h1 className="text-2xl font-semibold">{user.name}</h1>
              <p className="text-pink-100">
                {ROLE_LABELS[user.role] || user.role}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8 flex gap-3">
          <Link
            to="/profile/travel-history"
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            📜 Travel history
          </Link>
          <Link
            to="/profile/favorite-destinations"
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ⭐ Favorite destinations
          </Link>
        </div>

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
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700 disabled:opacity-60"
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
  );
}