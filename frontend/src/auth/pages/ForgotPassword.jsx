import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaPlaneDeparture } from "react-icons/fa";
import travelVideo from "../../assets/videos/travel.mp4";
import "../styles/login.css";
import { forgotPassword } from "../services/authService";

function ForgotPassword() {

    const [email, setEmail] = useState("");

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        setError("");

        setMessage("");

        try {

            const response = await forgotPassword(email);

            setMessage(
                response.data.message ||
                "Password reset link sent to your email."
            );

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Unable to send reset email."
            );

        }

        setLoading(false);

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

                    <FaPlaneDeparture className="plane-icon"/>

                    <h1 className="logo">
                        Trip<span>Nest</span>
                    </h1>

                    <p>Reset your password</p>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="input-group">

                        <FaEnvelope className="input-icon"/>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                            required
                        />

                    </div>

                    {error &&

                        <p className="error-msg">
                            {error}
                        </p>

                    }

                    {message &&

                        <p
                            style={{
                                color:"#7CFC98",
                                textAlign:"center",
                                marginBottom:"15px"
                            }}
                        >
                            {message}
                        </p>

                    }

                    <button
                        className="login-btn"
                    >

                        {

                            loading ?

                            "Sending..."

                            :

                            "Send Reset Link"

                        }

                    </button>

                </form>

                <p className="register-text">

                    <Link to="/login">

                        Back to Login

                    </Link>

                </p>

            </div>

        </div>

    );

}

export default ForgotPassword;