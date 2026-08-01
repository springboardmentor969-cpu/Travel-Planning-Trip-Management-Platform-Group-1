import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError(null);
    setSubmitting(true);

    const result = await login(username, password);

    setSubmitting(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Login failed.');
    }
  };

  const handleGoogleLogin = async () => {
    const simulatedEmail = prompt("Simulate Google Account Picker:\nEnter a Google Account email to authenticate:", "travel.designer@gmail.com");
    if (!simulatedEmail) return;
    
    if (!simulatedEmail.includes("@")) {
      alert("Invalid email format!");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch('http://localhost:8010/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: simulatedEmail,
          name: simulatedEmail.split('@')[0],
          googleId: "G-" + Math.floor(Math.random() * 1000000)
        })
      });

      const data = await response.json();
      setSubmitting(false);

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
          id: data.id,
          username: data.username,
          email: data.email,
          roles: data.roles
        }));
        
        window.location.href = '/dashboard';
      } else {
        setError(data.message || 'Google Login failed.');
      }
    } catch (err: any) {
      setSubmitting(false);
      setError('Could not connect to authentication server.');
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

          {/* Right Side: Login Card */}
          <div className="col-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-end pe-md-5">
            <div className="glass-container auth-card p-4 p-md-5 animate-fade-in text-white border-0 shadow-lg" style={{ maxWidth: '420px', width: '100%', background: 'rgba(15, 23, 42, 0.18)', backdropFilter: 'blur(30px) saturate(180%)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <div className="auth-header text-center mb-4">
                <h2 className="auth-title text-white fs-3 fw-bold mb-1">
                  Welcome Back
                </h2>
                <p className="auth-subtitle text-white text-opacity-60 text-xxs mb-0">Log in to coordinate your itineraries and budgets</p>
              </div>

              {error && (
                <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <div className="text-xs">{error}</div>
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
                      className="form-control form-input"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                      required
                    />
                  </div>
                </div>

                <div className="form-group mb-4">
                  <label className="form-label text-white text-xxs" htmlFor="password">Password</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-lock"></i></span>
                    <input
                      type="password"
                      id="password"
                      className="form-control form-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right"></i> Sign In
                    </>
                  )}
                </button>
              </form>

              <div className="text-center my-3 position-relative">
                <hr className="bg-white bg-opacity-20" />
                <span className="position-absolute top-50 start-50 translate-middle px-2 text-xxs text-white text-opacity-40" style={{ background: '#1c1e30', borderRadius: '4px' }}>OR</span>
              </div>

              <button
                type="button"
                className="btn btn-outline-light w-100 py-2 d-flex align-items-center justify-content-center gap-2 text-xs fw-semibold"
                style={{ borderRadius: '10px', borderColor: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.05)' }}
                onClick={handleGoogleLogin}
              >
                <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="Google" style={{ width: '16px', height: '16px', objectFit: 'contain' }} /> 
                Continue with Google
              </button>

              <div className="auth-footer text-center mt-4 text-xs text-white text-opacity-80">
                Don't have an account?{' '}
                <Link to="/register" className="auth-link fw-semibold text-info" style={{ textDecoration: 'none' }}>
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
