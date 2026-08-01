import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="footer py-5 mt-5">
      <div className="container">
        <div className="row g-4 footer-grid">
          <div className="col-12 col-md-5 footer-col">
            <h3 className="nav-logo mb-3" style={{ fontSize: '1.4rem' }}>
              <i className="bi bi-globe2 me-2"></i><span style={{ fontStyle: 'italic', fontWeight: 800 }}>TravelPlanner</span>
            </h3>

            <p className="pe-md-5" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              Your ultimate companion for structuring itineraries, managing travel budgets, and discovering beautiful destinations around the world.
            </p>
          </div>
  
          <div className="col-6 col-sm-4 col-md-2 footer-col">
            <h5 className="footer-col-title">Plan</h5>
            <ul className="footer-links list-unstyled">
              <li className="mb-2"><Link to="/dashboard" className="text-decoration-none">My Dashboard</Link></li>
              <li className="mb-2"><a href="#trips" className="text-decoration-none">Trips Planner</a></li>
              <li className="mb-2"><a href="#destinations" className="text-decoration-none">Destinations</a></li>
              <li className="mb-2"><a href="#budgeting" className="text-decoration-none">Budget Helper</a></li>
            </ul>
          </div>
  
          <div className="col-6 col-sm-4 col-md-2 footer-col">
            <h5 className="footer-col-title">Company</h5>
            <ul className="footer-links list-unstyled">
              <li className="mb-2"><a href="#about" className="text-decoration-none">About Us</a></li>
              <li className="mb-2"><a href="#careers" className="text-decoration-none">Careers</a></li>
              <li className="mb-2"><a href="#press" className="text-decoration-none">Press Center</a></li>
              <li className="mb-2"><a href="#partners" className="text-decoration-none">Partners</a></li>
            </ul>
          </div>
  
          <div className="col-6 col-sm-4 col-md-2 footer-col">
            <h5 className="footer-col-title">Support</h5>
            <ul className="footer-links list-unstyled">
              <li className="mb-2"><a href="#faq" className="text-decoration-none">Help FAQ</a></li>
              <li className="mb-2"><a href="#terms" className="text-decoration-none">Terms of Service</a></li>
              <li className="mb-2"><a href="#privacy" className="text-decoration-none">Privacy Policy</a></li>
              <li className="mb-2"><a href="#contact" className="text-decoration-none">Contact Support</a></li>
            </ul>
          </div>
        </div>
  
        <hr className="my-4" style={{ opacity: 0.15 }} />
  
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 footer-bottom">
          <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>
            &copy; {new Date().getFullYear()} TravelPlanner Inc. All rights reserved.
          </p>
          <div className="d-flex gap-3 social-links">
            <a href="#fb" className="social-icon" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
            <a href="#tw" className="social-icon" aria-label="Twitter"><i className="bi bi-twitter"></i></a>
            <a href="#ig" className="social-icon" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
            <a href="#yt" className="social-icon" aria-label="YouTube"><i className="bi bi-youtube"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

