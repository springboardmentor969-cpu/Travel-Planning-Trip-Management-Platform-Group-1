import {
    FaHeart,
    FaRegHeart,
    FaEye,
    FaEdit,
    FaTrash,
    FaShareAlt,
    FaStream,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaWallet
} from "react-icons/fa";

import "../styles/tripCard.css";
import getDestinationImage from "../utils/getDestinationImage";

function TripCard({

    trip,

    toggleFavorite,

    onView,

    onEdit,

    onShare,

    onTimeline,

    onDelete

}) {

    const image = getDestinationImage(trip.destination);

    const favorite = trip.favourite;

    return (

        <div className="trip-card">

            {/* Trip Image */}

            <div className="trip-image">

                <img
                    src={image}
                    alt={trip.title}
                />

                {/* Favourite */}

                <button
                    className="favorite-btn"
                    onClick={() => toggleFavorite(trip)}
                >
                    {
                        favorite
                            ?
                            <FaHeart />
                            :
                            <FaRegHeart />
                    }
                </button>

                {/* Status */}

                <span
                    className={`trip-status ${trip.status.toLowerCase()}`}
                >
                    {trip.status}
                </span>

            </div>

            {/* Content */}

            <div className="trip-content">

                <h3>{trip.title}</h3>

                <p className="trip-location">

                    <FaMapMarkerAlt />

                    {trip.destination}

                </p>

                <p className="trip-description">

                    {trip.description}

                </p>

                <div className="trip-details">

                    <div>

                        <FaCalendarAlt />

                        <span>

                            {trip.startDate} - {trip.endDate}

                        </span>

                    </div>

                    <div>

                        <FaWallet />

                        <span>

                            ₹ {trip.budget}

                        </span>

                    </div>

                </div>

            </div>

            {/* Action Buttons */}

            <div className="trip-actions">

                <button
                    className="action-btn view-btn"
                    title="View Trip"
                    onClick={() => onView(trip)}
                >
                    <FaEye />
                </button>

                <button
                    className="action-btn edit-btn"
                    title="Edit Trip"
                    onClick={() => onEdit(trip)}
                >
                    <FaEdit />
                </button>

                <button
                    className="action-btn timeline-btn"
                    title="Timeline"
                    onClick={() => onTimeline(trip)}
                >
                    <FaStream />
                </button>

                <button
                    className="action-btn share-btn"
                    title="Share Trip"
                    onClick={() => onShare(trip)}
                >
                    <FaShareAlt />
                </button>

                <button
                    className="action-btn delete-btn"
                    title="Delete Trip"
                    onClick={() => onDelete(trip.id)}
                >
                    <FaTrash />
                </button>

            </div>

        </div>

    );

}

export default TripCard;