import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import { Plane, Compass, ArrowLeft } from 'lucide-react';
import manaliImg from '../assets/manali.jpg';

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
    setFormData((prev) => ({...prev, [name]: value }));
    setValidationErrors((prev) => ({...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});
    try {
      await register(formData.name, formData.email, formData.password, formData.passwordConfirm);
      navigate('/dashboard');
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.errors) setValidationErrors(errorData.errors);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050A18]">
      {/* Left panel - Hero Visual */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <img src={manaliImg} alt="Travel background" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-[#050A18]/90" />

        <div className="absolute inset-0 flex-col justify-between p-12 text-white">
          <Link to="/" className="inline-flex items-center gap-2.5 text-lg font-bold tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-r from-amber-500 to-teal-500 text-white shadow-md">
              <Plane className="h-4.5 w-4.5 -rotate-45" />
            </span>
            TripNest
          </Link>

          <div className="space-y-6">
            <blockquote className="text-3xl font-light leading-relaxed">
              "To travel is to live, to let go of plans and discover the beauty of the unexpected."
            </blockquote>
            <cite className="block text-sm not-italic font-semibold text-amber-400">— Hans Christian Andersen</cite>
          </div>

          <div className="flex items-center gap-2 text-xs text-white/60 font-medium">
            <Compass className="h-4 w-4 text-teal-400" />
            Join thousands of travelers planning their dream itineraries.
          </div>
        </div>
      </div>

      {/* Right panel - Form Canvas - DARK GLASS */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16 xl:px-24 bg-[#050A18] relative">
        <Link to="/" className="absolute top-8 left-8 lg:left-16 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition font-medium">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="mx-auto w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Create Account</h1>
            <p className="mt-2 text-sm text-white/60 font-light">Join TripNest today to begin planning your next trip</p>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl bg-red-500/10 border-red-500/30 p-4">
              <p className="text-sm font-semibold text-red-400">{error}</p>
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
              required
            />

            <FormInput
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              error={validationErrors.email}
              required
            />

            <FormInput
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              error={validationErrors.password}
              required
            />

            <FormInput
              label="Confirm Password"
              type="password"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              placeholder="Confirm password"
              error={validationErrors.passwordConfirm}
              required
            />

            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-white/60">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-amber-400 hover:text-amber-300 transition">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}