import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import authApi from "../api/authApi";
import FormField from "../components/FormField";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!form.password || form.password.length < 8)
      next.password = "Password must be at least 8 characters.";
    if (form.confirmPassword !== form.password)
      next.confirmPassword = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!token) {
      setSubmitError("This reset link is invalid or has expired.");
      return;
    }
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await authApi.resetPassword({ token, newPassword: form.password });
      setIsDone(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setSubmitError(
        err.response?.data?.message ||
          "This reset link is invalid or has expired."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-cyan-600 via-teal-700 to-slate-900 p-10 text-white lg:flex">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="relative z-10 text-2xl font-semibold tracking-tight">
          TripNest
        </div>
        <div className="relative z-10 max-w-sm">
          <h2 className="mb-3 text-3xl font-semibold leading-snug">
            Almost there.
          </h2>
          <p className="text-cyan-100">Choose a new password to get back in.</p>
        </div>
        <div className="relative z-10 text-sm text-cyan-100">
          © {new Date().getFullYear()} TripNest
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-slate-50 px-4 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <span className="text-xl font-semibold text-teal-700">
              TripNest
            </span>
          </div>

          <h1 className="mb-1 text-2xl font-semibold text-slate-900">
            Set a new password
          </h1>
          <p className="mb-6 text-sm text-slate-500">
            Choose a new password for your account.
          </p>

          {isDone ? (
            <div className="flex flex-col items-center rounded-lg bg-green-50 px-4 py-6 text-center">
              <span className="mb-2 text-2xl">✅</span>
              <p className="text-sm text-green-700">
                Password updated. Redirecting to sign in…
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {submitError && (
                <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  {submitError}
                </div>
              )}
              <FormField
                label="New password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
                autoComplete="new-password"
              />
              <FormField
                label="Confirm new password"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                autoComplete="new-password"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-teal-600 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-teal-700 disabled:opacity-60"
              >
                {isSubmitting ? "Updating…" : "Update password"}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-slate-500">
            <Link to="/login" className="font-medium text-teal-600 hover:underline">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}