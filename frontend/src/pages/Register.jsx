import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Plane, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import FormInput from '../components/FormInput';
import Button from '../components/Button';

export default function Register() {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setValidationErrors((prev) => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});

    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.passwordConfirm
      );
      navigate('/');
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.errors) {
        setValidationErrors(errorData.errors);
      }
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]">
      <div className="order-2 flex items-center justify-center px-6 py-10 lg:order-1 lg:px-10">
        <div className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-soft backdrop-blur-xl">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Create account</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">Start planning your next trip</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Create an account to save trips, itineraries, budgets, and destinations.</p>
          </div>

          {error && (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              error={validationErrors.name}
            />

            <FormInput
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              error={validationErrors.email}
            />

            <FormInput
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              error={validationErrors.password}
            />

            <FormInput
              label="Confirm Password"
              type="password"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              placeholder="Confirm your password"
              error={validationErrors.passwordConfirm}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="relative order-1 flex items-center overflow-hidden px-6 py-10 lg:order-2 lg:px-12">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.22),transparent_32%),linear-gradient(135deg,#0f172a_0%,#1e293b_45%,#312e81_100%)]" />
        <div className="absolute right-8 top-8 h-28 w-28 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="absolute bottom-10 left-10 h-32 w-32 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="mx-auto max-w-xl text-white">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-blue-50 backdrop-blur">
            <Plane className="h-4 w-4" />
            TripNest travel workspace
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight md:text-6xl">Keep every trip, budget, and itinerary together.</h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-300 md:text-lg">
            A cleaner, faster travel planning experience designed for focused trip management.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Sparkles, title: 'Polished UI', text: 'Premium dashboard feel' },
              { icon: ShieldCheck, title: 'Secure login', text: 'JWT-protected sessions' },
              { icon: Plane, title: 'Trip control', text: 'Create and manage journeys' }
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <Icon className="h-5 w-5 text-blue-200" />
                <h2 className="mt-3 text-sm font-semibold uppercase tracking-wide text-white">{title}</h2>
                <p className="mt-2 text-sm text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
