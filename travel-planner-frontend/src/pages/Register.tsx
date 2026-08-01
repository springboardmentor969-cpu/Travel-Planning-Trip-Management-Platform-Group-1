import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Register.css';

export const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError(null);
    setSuccess(null);
    setSubmitting(true);

    const result = await register(username, email, password, '', '');

    setSubmitting(false);

    if (result.success) {
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(result.message || 'Registration failed.');
    }
  };

  return (
    <div className="auth-page vh-100 w-100 d-flex align-items-center position-relative">
      <div className="container-fluid h-100">
        <div className="row h-100 align-items-center px-4 px-md-5">
          {/* Left Side: beautiful title */}
          <div className="col-12 col-md-7 text-start d-none d-md-flex flex-column justify-content-center text-white ps-md-5 animate-fade-in-up">
            <div className="logo-container mb-3" style={{ marginLeft: '-10px' }}>
              <div className="logo-icon-wrapper" style={{ height: '54px', width: '54px' }}>
                <img 
                  src="/images/logo_icon.png" 
                  alt="TripPlanner Logo" 
                  className="logo-icon" 
                />
              </div>
              <div className="logo" style={{ fontSize: '42px' }}>Trip<span>Planner</span></div>
            </div>
            <p className="lead text-white text-opacity-80 fs-5 mb-4" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)', maxWidth: '520px', lineHeight: '1.6' }}>
              Design custom travel itineraries, monitor real-time expense thresholds, and coordinate seamlessly with your co-planners in a stunning, cosmic-styled workspace.
            </p>
            <div className="d-flex gap-3">
              <span className="badge rounded-pill bg-white bg-opacity-10 border border-white border-opacity-10 px-3 py-2 text-xxs text-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}><i className="bi bi-calendar-event me-1.5 text-info"></i> Itineraries</span>
              <span className="badge rounded-pill bg-white bg-opacity-10 border border-white border-opacity-10 px-3 py-2 text-xxs text-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}><i className="bi bi-wallet2 me-1.5 text-success"></i> Budgets</span>
              <span className="badge rounded-pill bg-white bg-opacity-10 border border-white border-opacity-10 px-3 py-2 text-xxs text-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}><i className="bi bi-people-fill me-1.5 text-warning"></i> Collaboration</span>
            </div>
          </div>

          {/* Right Side: Register Card */}
          <div className="col-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-end pe-md-5">
            <div className="glass-container auth-card p-4 p-md-5 animate-fade-in text-white border-0 shadow-lg" style={{ maxWidth: '420px', width: '100%', background: 'rgba(15, 23, 42, 0.18)', backdropFilter: 'blur(30px) saturate(180%)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <div className="auth-header text-center mb-4">
                <h2 className="auth-title text-white fs-3 fw-bold mb-1">
                  Create Account
                </h2>
                <p className="auth-subtitle text-white text-opacity-60 text-xxs mb-0">Join us to plan your next adventures</p>
              </div>

              {error && (
                <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <div className="text-xs">{error}</div>
                </div>
              )}

              {success && (
                <div className="alert alert-success d-flex align-items-center mb-3" role="alert">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  <div className="text-xs">{success}</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label className="form-label text-white text-xxs" htmlFor="username">Username</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-person"></i></span>
                    <input
                      type="text"
                      id="username"
                      className="form-control form-input text-xs"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="johndoe"
                      required
                    />
                  </div>
                </div>

                <div className="form-group mb-3">
                  <label className="form-label text-white text-xxs" htmlFor="email">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                    <input
                      type="email"
                      id="email"
                      className="form-control form-input text-xs"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-group mb-3">
                  <label className="form-label text-white text-xxs" htmlFor="password">Password</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-lock"></i></span>
                    <input
                      type="password"
                      id="password"
                      className="form-control form-input text-xs"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div className="form-group mb-4">
                  <label className="form-label text-white text-xxs" htmlFor="confirmPassword">Confirm Password</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-shield-lock"></i></span>
                    <input
                      type="password"
                      id="confirmPassword"
                      className="form-control form-input text-xs"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2.5 d-flex align-items-center justify-content-center gap-2 text-xs fw-bold"
                  disabled={submitting}
                  style={{ borderRadius: '10px' }}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-rocket-takeoff-fill"></i> Sign Up
                    </>
                  )}
                </button>
              </form>

              <div className="auth-footer text-center mt-4 text-xs text-white text-opacity-80">
                Already have an account?{' '}
                <Link to="/login" className="auth-link fw-semibold text-info" style={{ textDecoration: 'none' }}>
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

