
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { updateTrip } from "../services/tripService";

import "../styles/createTripModal.css";

function EditTripModal({ open, onClose, trip, reloadTrips }) {

    const emptyTrip = {
        userId: 1,
        tripName: "",
        destination: "",
        startDate: "",
        endDate: "",
        budget: "",
        status: "Planned",
        description: ""
    };

    const [formData, setFormData] = useState(emptyTrip);

    useEffect(() => {

        if (trip) {

            setFormData({
                userId: trip.userId,
                tripName: trip.tripName || "",
                destination: trip.destination || "",
                startDate: trip.startDate || "",
                endDate: trip.endDate || "",
                budget: trip.budget || "",
                status: trip.status || "Planned",
                description: trip.description || ""
            });

        }

    }, [trip]);

    if (!open || !trip) return null;

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await updateTrip(trip.id, formData);

            await reloadTrips();

            alert("Trip updated successfully!");

            setFormData(emptyTrip);

            onClose();

        }

        catch (error) {

            console.error(error);

            alert("Failed to update trip.");

        }

    };

    const handleClose = () => {

        setFormData(emptyTrip);

        onClose();

    };

    return (

        <div className="modal-overlay">

            <div className="trip-modal">

                <div className="modal-header">

                    <h2>Edit Trip</h2>

                    <button onClick={handleClose}>

                        <FaTimes />

                    </button>

                </div>

                <form
                    className="trip-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label>Trip Name</label>

                        <input
                            type="text"
                            name="tripName"
                            value={formData.tripName}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Destination</label>

                        <input
                            type="text"
                            name="destination"
                            value={formData.destination}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="double-input">

                        <div className="form-group">

                            <label>Start Date</label>

                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label>End Date</label>

                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>

                    <div className="double-input">

                        <div className="form-group">

                            <label>Budget</label>

                            <input
                                type="number"
                                name="budget"
                                value={formData.budget}
                                onChange={handleChange}
                            />

                        </div>

                        <div className="form-group">

                            <label>Status</label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >

                                <option>Planned</option>
                                <option>Upcoming</option>
                                <option>Completed</option>

                            </select>

                        </div>

                    </div>

                    <div className="form-group">

                        <label>Description</label>

                        <textarea
                            rows="4"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="modal-buttons">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={handleClose}
                        >

                            Cancel

                        </button>

                        <button
                            type="submit"
                            className="save-btn"
                        >

                            Update Trip

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default EditTripModal;
