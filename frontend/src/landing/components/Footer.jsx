import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaArrowUp
} from "react-icons/fa";

import { Link } from "react-router-dom";

import "../styles/footer.css";

function Footer() {

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (

   <footer className="footer" id="contact">

      <div className="footer-container">

        <div className="footer-column">

          <h2 className="footer-logo">
            Trip<span>Nest</span>
          </h2>

          <p>
            Your trusted travel companion for discovering beautiful
            destinations, planning unforgettable trips and creating lifelong memories.
          </p>

          <div className="social-icons">

            <a href="#">
              <FaFacebookF />
            </a>

            <a href="#">
              <FaInstagram />
            </a>

            <a href="#">
              <FaTwitter />
            </a>

            <a href="#">
              <FaLinkedinIn />
            </a>

          </div>

        </div>

        <div className="footer-column">

          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/destinations">Destinations</Link>
          <Link to="/packages">Packages</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>

        </div>

        <div className="footer-column">

          <h3>Support</h3>

          <a href="#">FAQs</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms & Conditions</a>
          <a href="#">Refund Policy</a>

        </div>

        <div className="footer-column">

          <h3>Contact</h3>

          <p>
            <FaMapMarkerAlt /> Chennai, Tamil Nadu
          </p>

          <p>
            <FaPhoneAlt /> +91 98765 43210
          </p>

          <p>
            <FaEnvelope /> tripnest.infoteam@gmail.com
          </p>

        </div>

      </div>

      <div className="footer-bottom">

        <p>
          © 2026 TripNest. All Rights Reserved.
        </p>

        <button onClick={scrollTop}>

          <FaArrowUp />

        </button>

      </div>

    </footer>

  );

}

export default Footer;