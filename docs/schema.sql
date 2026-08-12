CREATE DATABASE IF NOT EXISTS tripnest;
USE tripnest;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS trips (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(140) NOT NULL,
    destination VARCHAR(140) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget DECIMAL(12, 2) NOT NULL,
    status VARCHAR(24) NOT NULL,
    user_id BIGINT NOT NULL,
    CONSTRAINT fk_trips_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS trip_collaborators (
    trip_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    PRIMARY KEY (trip_id, user_id),
    CONSTRAINT fk_trip_collaborators_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    CONSTRAINT fk_trip_collaborators_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS trip_invitations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    trip_id BIGINT NOT NULL,
    invited_by_user_id BIGINT NOT NULL,
    invitee_email VARCHAR(160) NOT NULL,
    status VARCHAR(24) NOT NULL,
    created_at DATETIME NOT NULL,
    responded_at DATETIME,
    CONSTRAINT fk_trip_invitations_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    CONSTRAINT fk_trip_invitations_invited_by FOREIGN KEY (invited_by_user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS itineraries (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    day_number INT NOT NULL,
    title VARCHAR(140) NOT NULL,
    description VARCHAR(1000),
    activity_type VARCHAR(32),
    activity_time TIME,
    trip_id BIGINT NOT NULL,
    CONSTRAINT fk_itineraries_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS expenses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category VARCHAR(80) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    description VARCHAR(500),
    expense_date DATE NOT NULL,
    trip_id BIGINT NOT NULL,
    CONSTRAINT fk_expenses_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);
