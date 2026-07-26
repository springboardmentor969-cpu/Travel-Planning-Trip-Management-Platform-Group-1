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
    <div className="flex min-h-screen">
      {/* Left panel — brand/visual side */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-amber-500 via-orange-600 to-slate-900 p-10 text-white lg:flex">
        <div className="absolute inset-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        <div className="relative z-10 text-2xl font-semibold tracking-tight">
          TripNest
        </div>

        <div className="relative z-10 max-w-sm">
          <h2 className="mb-3 text-3xl font-semibold leading-snug">
            Every trip starts with a plan.
          </h2>
          <p className="text-orange-100">
            Join travelers organizing itineraries, budgets, and group trips
            without the spreadsheet chaos.
          </p>
        </div>

        <div className="relative z-10 flex gap-6 text-sm text-orange-100">
          <div>
            <p className="text-xl font-semibold text-white">10+</p>
            <p>Planning tools</p>
          </div>
          <div>
            <p className="text-xl font-semibold text-white">100%</p>
            <p>Free to start</p>
          </div>
        </div>
      </div>

      {/* Right panel — the form */}
      <div className="flex w-full items-center justify-center bg-slate-50 px-4 py-10 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <span className="text-xl font-semibold text-teal-700">
              TripNest
            </span>
          </div>

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
                        ? "border-teal-600 bg-teal-50 text-teal-700"
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
              className="w-full rounded-lg bg-teal-600 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-teal-700 disabled:opacity-60"
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
    </div>
  );
}