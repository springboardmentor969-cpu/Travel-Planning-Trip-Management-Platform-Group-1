import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FormField from "../components/FormField";

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!form.email) next.email = "Email is required.";
    if (!form.password) next.password = "Password is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || "Invalid email or password."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Full-bleed background photo */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-teal-900/70 to-slate-900/90" />
      </div>

      {/* Brand mark, top-left */}
      <div className="absolute left-8 top-8 z-10 text-xl font-semibold text-white">
        TripNest
      </div>

      {/* Glass card */}
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur">
        <h1 className="mb-1 text-2xl font-semibold text-slate-900">
          Welcome back
        </h1>
        <p className="mb-6 text-sm text-slate-500">
          Sign in to continue planning your trips.
        </p>

        {submitError && (
          <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <FormField
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="email"
          />
          <FormField
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="current-password"
          />

          <div className="mb-4 text-right">
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-teal-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 py-2.5 text-sm font-medium text-white shadow-sm transition hover:from-teal-700 hover:to-emerald-700 disabled:opacity-60"
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs text-slate-400">OR</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <button
          type="button"
          onClick={loginWithGoogle}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M23.49 12.27c0-.82-.07-1.42-.22-2.05H12v3.91h6.47c-.13 1.05-.83 2.63-2.39 3.69l-.02.14 3.47 2.69.24.02c2.21-2.04 3.72-5.04 3.72-8.4z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.78-2.93c-1.02.71-2.38 1.21-4.15 1.21-3.18 0-5.87-2.1-6.83-5H1.28v3.03C3.26 21.3 7.29 24 12 24z" />
            <path fill="#FBBC05" d="M5.17 14.37A7.15 7.15 0 0 1 4.8 12c0-.82.14-1.62.37-2.37V6.6H1.28A11.94 11.94 0 0 0 0 12c0 1.93.46 3.76 1.28 5.4z" />
            <path fill="#EA4335" d="M12 4.75c2.28 0 3.82.98 4.7 1.8l3.43-3.35C17.94 1.19 15.24 0 12 0 7.29 0 3.26 2.7 1.28 6.6l3.89 3.03c.96-2.9 3.65-4.88 6.83-4.88z" />
          </svg>
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-teal-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      <p className="absolute bottom-6 z-10 text-xs text-teal-100/70">
        © {new Date().getFullYear()} TripNest · Plan your next adventure
      </p>
    </div>
  );
}