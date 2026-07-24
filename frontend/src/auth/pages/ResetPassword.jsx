import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaLock, FaEye, FaEyeSlash, FaPlaneDeparture } from "react-icons/fa";
import travelVideo from "../../assets/videos/travel.mp4";
import "../styles/login.css";
import { resetPassword } from "../services/authService";

function ResetPassword() {

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        if (password.length < 6) {

            setError("Password must be at least 6 characters.");

            return;

        }

        if (password !== confirmPassword) {

            setError("Passwords do not match.");

            return;

        }

        setLoading(true);

        try {

            await resetPassword({
                token,
                newPassword: password
            });

            alert("Password updated successfully.");

            navigate("/login");

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Unable to reset password."
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
                <source src={travelVideo} type="video/mp4"/>
            </video>

            <div className="video-overlay"></div>

            <div className="login-card">

                <div className="logo-section">

                    <FaPlaneDeparture className="plane-icon"/>

                    <h1 className="logo">
                        Trip<span>Nest</span>
                    </h1>

                    <p>Create a new password</p>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="input-group">

                        <FaLock className="input-icon"/>

                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="New Password"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                            required
                        />

                        <button
                            type="button"
                            className="eye-btn"
                            onClick={()=>setShowPassword(!showPassword)}
                        >
                            {
                                showPassword
                                ? <FaEyeSlash/>
                                : <FaEye/>
                            }
                        </button>

                    </div>

                    <div className="input-group">

                        <FaLock className="input-icon"/>

                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e)=>setConfirmPassword(e.target.value)}
                            required
                        />

                        <button
                            type="button"
                            className="eye-btn"
                            onClick={()=>setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {
                                showConfirmPassword
                                ? <FaEyeSlash/>
                                : <FaEye/>
                            }
                        </button>

                    </div>

                    {
                        error &&
                        <p className="error-msg">
                            {error}
                        </p>
                    }

                    <button
                        className="login-btn"
                    >
                        {
                            loading
                            ? "Updating..."
                            : "Reset Password"
                        }
                    </button>

                </form>

            </div>

        </div>

    );

}

export default ResetPassword;