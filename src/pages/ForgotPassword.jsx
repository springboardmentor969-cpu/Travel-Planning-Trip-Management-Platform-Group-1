import { useState } from "react";
import { Link } from "react-router-dom";
import authApi from "../api/authApi";
import FormField from "../components/FormField";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Enter the email associated with your account.");
      return;
    }
    setIsSubmitting(true);
    try {
      await authApi.forgotPassword({ email });
      setIsSent(true);
    } catch (err) {
      setIsSent(true);
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
            Locked out happens to everyone.
          </h2>
          <p className="text-cyan-100">
            We'll email you a secure link to get back into your account.
          </p>
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
            Reset your password
          </h1>
          <p className="mb-6 text-sm text-slate-500">
            Enter your email and we'll send you a link to reset it.
          </p>

          {isSent ? (
            <div className="flex flex-col items-center rounded-lg bg-green-50 px-4 py-6 text-center">
              <span className="mb-2 text-2xl">📬</span>
              <p className="text-sm text-green-700">
                If an account exists for {email}, a reset link is on its way.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {error && (
                <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </div>
              )}
              <FormField
                label="Email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-teal-600 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-teal-700 disabled:opacity-60"
              >
                {isSubmitting ? "Sending…" : "Send reset link"}
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