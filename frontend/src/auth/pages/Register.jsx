import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaPlaneDeparture
} from "react-icons/fa";
import travelVideo from "../../assets/videos/travel.mp4";
import "../styles/login.css";
import { register } from "../services/authService";

function Register() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {

      await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        role: "TRAVELER"
      });

      alert("Registration Successful! Please verify your email.");

      navigate("/login");

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Registration failed."
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="login-page">

      <video
        autoPlay
        muted
        loop
        playsInline
        className="background-video"
      >
        <source src={travelVideo} type="video/mp4" />
      </video>

      <div className="video-overlay"></div>

      <div className="login-card">

        <div className="logo-section">

          <FaPlaneDeparture className="plane-icon" />

          <h1 className="logo">
            Trip<span>Nest</span>
          </h1>

          <p>Create your account</p>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="input-group">

            <FaUser className="input-icon" />

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              required
            />

          </div>

          <div className="input-group">

            <FaEnvelope className="input-icon" />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
            />

          </div>

          <div className="input-group">

            <FaLock className="input-icon" />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>

          </div>

          <div className="input-group">

            <FaLock className="input-icon" />

            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>

          </div>

          {
            error &&
            <p className="error-msg">
              {error}
            </p>
          }

          <button
            type="submit"
            className="login-btn"
          >
            {
              loading
                ? "Creating Account..."
                : "Create Account"
            }
          </button>

        </form>

        <p className="register-text">

          Already have an account?

          <Link to="/login">
            Login
          </Link>

        </p>

      </div>

    </div>

  );

}

export default Register;