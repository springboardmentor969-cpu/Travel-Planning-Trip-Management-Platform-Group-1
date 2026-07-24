import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { createTrip } from "../services/tripService";

import "../styles/createTripModal.css";

function CreateTripModal({
    open,
    onClose,
    reloadTrips,
    selectedDestination
}) {

    const initialTrip = {
        userId: 1,
        tripName: "",
        destination: "",
        startDate: "",
        endDate: "",
        budget: "",
        status: "Planned",
        description: "",
        numberOfPersons: 1,
        travellers: [""]
    };

    const [trip, setTrip] = useState(initialTrip);

    useEffect(() => {

        if (open) {

            setTrip(prev => ({
                ...prev,
                destination: selectedDestination || ""
            }));

        }

    }, [open, selectedDestination]);

    if (!open) return null;

    const handleChange = (e) => {

        const { name, value } = e.target;

        if (name === "numberOfPersons") {

            const count = parseInt(value) || 1;

            setTrip(prev => ({
                ...prev,
                numberOfPersons: count,
                travellers: Array(count)
                    .fill("")
                    .map((_, index) => prev.travellers[index] || "")
            }));

            return;
        }

        setTrip(prev => ({
            ...prev,
            [name]: value
        }));

    };

    const handleTravellerChange = (index, value) => {

        const updated = [...trip.travellers];

        updated[index] = value;

        setTrip(prev => ({
            ...prev,
            travellers: updated
        }));

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            // Remove traveller details if backend doesn't support them yet
            const payload = {
                userId: trip.userId,
                tripName: trip.tripName,
                destination: trip.destination,
                startDate: trip.startDate,
                endDate: trip.endDate,
                budget: trip.budget,
                status: trip.status,
                description: trip.description
            };

            await createTrip(payload);

            await reloadTrips();

            setTrip(initialTrip);

            onClose();

        }

        catch (error) {

            console.error(error);

            alert("Failed to create trip.");

        }

    };

    return (

        <div className="modal-overlay">

            <div className="trip-modal">

                <div className="modal-header">

                    <h2>Create New Trip</h2>

                    <button
                        type="button"
                        onClick={onClose}
                    >
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
                            value={trip.tripName}
                            onChange={handleChange}
                            placeholder="Enter trip name"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Destination</label>

                        <input
                            type="text"
                            name="destination"
                            value={trip.destination}
                            onChange={handleChange}
                            placeholder="Destination"
                            required
                        />

                    </div>

                    <div className="double-input">

                        <div className="form-group">

                            <label>Start Date</label>

                            <input
                                type="date"
                                name="startDate"
                                value={trip.startDate}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label>End Date</label>

                            <input
                                type="date"
                                name="endDate"
                                value={trip.endDate}
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>

                    <div className="double-input">

                        <div className="form-group">

                            <label>Budget (₹)</label>

                            <input
                                type="number"
                                name="budget"
                                value={trip.budget}
                                onChange={handleChange}
                                placeholder="Estimated Budget"
                            />

                        </div>

                        <div className="form-group">

                            <label>Status</label>

                            <select
                                name="status"
                                value={trip.status}
                                onChange={handleChange}
                            >

                                <option>Planned</option>
                                <option>Upcoming</option>
                                <option>Completed</option>

                            </select>

                        </div>

                    </div>

                    <div className="form-group">

                        <label>Number of Travellers</label>

                        <input
                            type="number"
                            min="1"
                            name="numberOfPersons"
                            value={trip.numberOfPersons}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="form-group">

                        <label>Traveller Names</label>

                        {

                            trip.travellers.map((traveller, index) => (

                                <input
                                    key={index}
                                    type="text"
                                    placeholder={`Traveller ${index + 1}`}
                                    value={traveller}
                                    onChange={(e) =>
                                        handleTravellerChange(
                                            index,
                                            e.target.value
                                        )
                                    }
                                    style={{ marginBottom: "10px" }}
                                />

                            ))

                        }

                    </div>

                    <div className="form-group">

                        <label>Description</label>

                        <textarea
                            rows="5"
                            name="description"
                            value={trip.description}
                            onChange={handleChange}
                            placeholder="Write something about your trip..."
                        />

                    </div>

                    <div className="modal-buttons">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="save-btn"
                        >
                            Save Trip
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default CreateTripModal;