import { useEffect } from "react";

import {
    FaTimes,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaWallet,
    FaInfoCircle
} from "react-icons/fa";

import "../styles/viewTripModal.css";

function ViewTripModal({ trip, open, onClose }) {

    useEffect(() => {

        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };

    }, [open]);

    if (!open) return null;

    if (!open || !trip) return null;

    return (

        <div className="modal-overlay"
            onClick={onClose}
        >
        <div className="view-modal"
            onClick={(e) => e.stopPropagation()}
        >

                <button
                    className="close-btn"
                    onClick={onClose}
                >
                    <FaTimes />
                </button>

                <img
                    src={trip.image ||`https://picsum.photos/900/500?random=${trip.id}`}
                    alt={trip.destination}
                    className="view-image"
                />

                <div className="view-body">

                    <h2>{trip.tripName}</h2>

                    <div className="detail">

                        <FaMapMarkerAlt />

                        <span>{trip.destination}</span>

                    </div>

                    <div className="detail">

                        <FaCalendarAlt />

                        <span>

                            {trip.startDate} - {trip.endDate}

                        </span>

                    </div>

                    <div className="detail">

                        <FaWallet />

                        <span>

                            ₹ {trip.budget}

                        </span>

                    </div>

                    <div className="detail">

                        <FaInfoCircle />

                        <span>{trip.status}</span>

                    </div>

                    <h3>Description</h3>

                    <p>

                        {trip.description}

                    </p>

                    <button
                        className="close-modal-btn"
                        onClick={onClose}
                    >

                        Close

                    </button>

                </div>

            </div>

        </div>

    );

}

export default ViewTripModal;
