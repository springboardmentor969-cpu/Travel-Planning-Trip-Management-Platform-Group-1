import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FormField from "../components/FormField";
import { ROLES, ROLE_LABELS } from "../utils/roles";

const SELF_SERVICE_ROLES = [ROLES.TRAVELER, ROLES.GROUP_ADMIN];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: ROLES.TRAVELER,
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!form.name) next.name = "Full name is required.";
    if (!form.email) next.email = "Email is required.";
    if (!form.password) next.password = "Password is required.";
    else if (form.password.length < 8)
      next.password = "Password must be at least 8 characters.";
    if (form.confirmPassword !== form.password)
      next.confirmPassword = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSuccessMessage("");
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      setSuccessMessage("Account created. Redirecting to sign in…");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setSubmitError(
        err.response?.data?.message ||
          "Could not create your account. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden py-10">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-orange-900/60 to-slate-900/90" />
      </div>

      <div className="absolute left-8 top-8 z-10 text-xl font-semibold text-white">
        TripNest
      </div>

      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur">
        <h1 className="mb-1 text-2xl font-semibold text-slate-900">
          Create your account
        </h1>
        <p className="mb-6 text-sm text-slate-500">
          Start planning trips with TripNest.
        </p>

        {submitError && (
          <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {submitError}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <FormField
            label="Full name"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
            autoComplete="name"
          />
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
            autoComplete="new-password"
          />
          <FormField
            label="Confirm password"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />

          <div className="mb-5">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              I'm joining as
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SELF_SERVICE_ROLES.map((role) => (
                <button
                  type="button"
                  key={role}
                  onClick={() => setForm((prev) => ({ ...prev, role }))}
                  className={`rounded-lg border px-3 py-2 text-sm transition ${
                    form.role === role
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-slate-300 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {ROLE_LABELS[role]}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-amber-600 py-2.5 text-sm font-medium text-white shadow-sm transition hover:from-orange-600 hover:to-amber-700 disabled:opacity-60"
          >
            {isSubmitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-teal-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}