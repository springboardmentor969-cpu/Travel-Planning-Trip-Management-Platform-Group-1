import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaPlaneDeparture
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import travelVideo from "../../assets/videos/travel.mp4";
import "../styles/login.css";

import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

const [loading, setLoading] = useState(false);

const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

 const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");

    try {

        const response = await login(form);

        // Save JWT
        localStorage.setItem(
            "token",
            response.data.token
        );

        // Save user details
        localStorage.setItem(
            "user",
            JSON.stringify(response.data)
        );

        // Go to Dashboard
        navigate("/dashboard");

    } catch (err) {

        setError(
            err.response?.data?.message ||
            "Invalid email or password"
        );

    } finally {

        setLoading(false);

    }

};  


  return (
    <div className="login-page">

      {/* Background Video */}
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

          <p>
            Plan • Explore • Travel
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="input-group">

            <FaEnvelope className="input-icon"/>

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

          <div className="forgot">

            <Link to="/forgot-password">
              Forgot Password?
            </Link>

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

            ? "Signing In..."

            : "Login"

    }

</button>

        </form>

        <div className="divider">
          <span>OR</span>
        </div>

       <button
    className="google-btn"
    onClick={() =>
        window.location.href =
            "http://localhost:8080/oauth2/authorization/google"
    }
>
          <FcGoogle size={26}/>
          Continue with Google
        </button>

        <p className="register-text">
          Don't have an account?

          <Link to="/register">
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;