import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  // Keep search box matching URL parameters (e.g. on direct link sharing or navigation reload)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setSearchQuery(searchParams.get('search') || '');
  }, [location.search]);

  // Night Mode state management
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    return saved !== 'light';
  });

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Notifications State & SSE stream listener
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    // Fetch existing notifications on mount
    const fetchNotifications = async () => {
      try {
        const res = await fetch('http://localhost:8010/api/notifications', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (err) {
        console.error('Failed to load notifications:', err);
      }
    };
    fetchNotifications();

    // Establish live real-time Server-Sent Events channel
    const eventSource = new EventSource(`http://localhost:8010/api/notifications/stream?userId=${user.id}`);
    
    eventSource.addEventListener('NOTIFICATION', (event: MessageEvent) => {
      setNotifications(prev => [
        {
          id: Date.now(),
          message: event.data,
          isRead: false,
          createdAt: new Date().toISOString()
        },
        ...prev
      ]);
    });

    eventSource.addEventListener('error', () => {
      eventSource.close();
    });

    return () => {
      eventSource.close();
    };
  }, [isAuthenticated, user?.id]);

  const handleMarkAsRead = async (notifId: number) => {
    try {
      const res = await fetch(`http://localhost:8010/api/notifications/${notifId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, isRead: true } : n));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (isAuthenticated) {
      if (val.trim()) {
        navigate(`/dashboard?search=${encodeURIComponent(val)}`);
      } else {
        navigate('/dashboard');
      }
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <nav className="navbar navbar-expand-lg px-4 py-2 shadow-sm">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link to="/" className="logo-container">
          <div className="logo-icon-wrapper">
            <img 
              src="/images/logo_icon.png" 
              alt="TripPlanner Logo" 
              className="logo-icon"
            />
          </div>
          <div className="logo">Trip<span>Planner</span></div>
        </Link>


        {isAuthenticated && (
          <form onSubmit={handleSearchSubmit} className="nav-search-container d-none d-md-flex align-items-center">
            <span className="nav-search-icon"><i className="bi bi-search"></i></span>
            <input
              type="text"
              className="form-control nav-search-input"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </form>
        )}

        <div className="nav-links d-flex align-items-center gap-3">
          {/* Theme Toggle Button (Always visible) */}
          <button 
            onClick={() => setIsDark(!isDark)} 
            className="btn btn-sm btn-outline-secondary theme-toggle-btn d-flex align-items-center gap-2"
          >
            {isDark ? (
              <>
                <i className="bi bi-sun-fill text-warning"></i>
                <span className="d-none d-sm-inline">Light Mode</span>
              </>
            ) : (
              <>
                <i className="bi bi-moon-stars-fill text-primary"></i>
                <span className="d-none d-sm-inline">Dark Mode</span>
              </>
            )}
          </button>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard?view=dashboard" className="nav-link-item text-decoration-none fw-semibold">
                <i className="bi bi-columns-gap me-1"></i>Dashboard
              </Link>
              
              {/* Notification Bell Dropdown */}
              <div className="position-relative notification-bell-container mx-2 d-flex align-items-center" ref={dropdownRef}>
                <button
                  onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                  className="btn btn-link nav-link-item p-0 position-relative text-decoration-none"
                  style={{ color: 'inherit', border: 'none', background: 'none' }}
                >
                  <i className="bi bi-bell-fill fs-5"></i>
                  {notifications.filter(n => !n.isRead).length > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger" style={{ fontSize: '0.55rem', padding: '0.25em 0.5em', transform: 'translate(-20%, -30%)' }}>
                      {notifications.filter(n => !n.isRead).length}
                    </span>
                  )}
                </button>

                {showNotifDropdown && (
                  <div className="glass-container position-absolute dropdown-menu show p-2 end-0 mt-3 shadow-lg" style={{ width: '290px', background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', zIndex: 1050, transform: 'translate(40px, 15px)' }}>
                    <div className="d-flex justify-content-between align-items-center px-2 py-1 border-bottom border-white border-opacity-10 mb-2">
                      <span className="text-xxs fw-bold text-white text-opacity-80">Notifications</span>
                      {notifications.filter(n => !n.isRead).length > 0 && (
                        <span className="text-xxs text-info cursor-pointer fw-semibold" style={{ fontSize: '10px' }} onClick={() => { notifications.forEach(n => !n.isRead && handleMarkAsRead(n.id)); setShowNotifDropdown(false); }}>Mark all read</span>
                      )}
                    </div>
                    <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <div className="text-center text-white text-opacity-40 py-3 text-xxs">No notifications yet</div>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} className={`p-2 rounded mb-1 border-bottom border-white border-opacity-5 ${n.isRead ? 'text-white text-opacity-50' : 'bg-white bg-opacity-5 text-white fw-semibold'}`} style={{ fontSize: '11px' }}>
                            <div className="d-flex justify-content-between align-items-start gap-1">
                              <span style={{ lineHeight: '1.3', display: 'inline-block' }}>{n.message}</span>
                              {!n.isRead && (
                                <button className="btn btn-xxs btn-outline-info p-0 px-1 border-0" onClick={() => { handleMarkAsRead(n.id); setShowNotifDropdown(false); }}>
                                  <i className="bi bi-check-lg" style={{ fontSize: '11px' }}></i>
                                </button>
                              )}
                            </div>
                            <span className="text-opacity-40 text-xxs d-block mt-1" style={{ fontSize: '9px' }}>
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="d-flex align-items-center gap-2">
                <span className="user-welcome-badge px-2 py-1 rounded">
                  <i className="bi bi-person-circle me-1"></i>{user?.username}
                </span>
              </div>
              <button 
                onClick={handleLogout} 
                className="btn btn-sm btn-danger logout-btn d-flex align-items-center gap-1"
              >
                <i className="bi bi-box-arrow-right"></i>Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link-item text-decoration-none fw-semibold">Login</Link>
              <Link to="/register" className="btn btn-sm btn-primary register-nav-btn fw-semibold px-3">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

