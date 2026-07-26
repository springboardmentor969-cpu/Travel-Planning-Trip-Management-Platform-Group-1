USE tripnest;

INSERT INTO users (id, name, email) VALUES
    (1, 'Demo Traveler', 'demo@tripnest.local')
ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email);

INSERT INTO trips (id, title, destination, start_date, end_date, budget, status, user_id) VALUES
    (1, 'Tokyo Spring Week', 'Tokyo, Japan', '2026-04-06', '2026-04-13', 3200.00, 'PLANNED', 1),
    (2, 'Lisbon Long Weekend', 'Lisbon, Portugal', '2026-09-18', '2026-09-22', 1400.00, 'PLANNED', 1)
ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    destination = VALUES(destination),
    start_date = VALUES(start_date),
    end_date = VALUES(end_date),
    budget = VALUES(budget),
    status = VALUES(status),
    user_id = VALUES(user_id);

INSERT INTO itineraries (id, day_number, title, description, trip_id) VALUES
    (1, 1, 'Arrive and settle in', 'Check in, explore the neighborhood, and keep dinner flexible.', 1),
    (2, 2, 'Museums and gardens', 'Visit Ueno Park, Tokyo National Museum, and an evening izakaya.', 1),
    (3, 1, 'Alfama walk', 'Arrive, check in, and walk through Alfama before dinner.', 2)
ON DUPLICATE KEY UPDATE
    day_number = VALUES(day_number),
    title = VALUES(title),
    description = VALUES(description),
    trip_id = VALUES(trip_id);

INSERT INTO expenses (id, category, amount, description, expense_date, trip_id) VALUES
    (1, 'Flights', 980.00, 'Round-trip airfare', '2026-01-15', 1),
    (2, 'Hotel', 640.00, 'Deposit for hotel booking', '2026-01-20', 1),
    (3, 'Food', 75.00, 'First night dinner estimate', '2026-09-18', 2)
ON DUPLICATE KEY UPDATE
    category = VALUES(category),
    amount = VALUES(amount),
    description = VALUES(description),
    expense_date = VALUES(expense_date),
    trip_id = VALUES(trip_id);
