# TripNest API

Base URL: `http://localhost:8080/api`

## Users

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/users` | Create a user |
| GET | `/users/{id}` | View a user |
| PUT | `/users/{id}` | Update a user |

User payload:

```json
{
  "name": "Demo Traveler",
  "email": "demo@tripnest.local"
}
```

## Trips

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/trips` | Create a trip |
| GET | `/trips` | List owned and shared trips |
| GET | `/trips/{id}` | View a trip |
| GET | `/trips/{id}/details` | View trip with itinerary, expenses, and budget |
| PUT | `/trips/{id}` | Update a trip |
| DELETE | `/trips/{id}` | Delete a trip |

Trip payload:

```json
{
  "title": "Tokyo Spring Week",
  "destination": "Tokyo, Japan",
  "startDate": "2026-04-06",
  "endDate": "2026-04-13",
  "budget": 3200,
  "status": "PLANNED",
  "userId": 1
}
```

## Itinerary

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/trips/{tripId}/itinerary` | Add itinerary day |
| GET | `/trips/{tripId}/itinerary` | List itinerary days |
| PUT | `/trips/{tripId}/itinerary/{itineraryId}` | Edit itinerary day |
| DELETE | `/trips/{tripId}/itinerary/{itineraryId}` | Delete itinerary day |

Itinerary payload:

```json
{
  "dayNumber": 1,
  "title": "Arrive and settle in",
  "description": "Check in and explore nearby cafes.",
  "activityType": "SIGHTSEEING",
  "activityTime": "09:00:00"
}
```

## Expenses and Budget

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/trips/{tripId}/expenses` | Add expense |
| GET | `/trips/{tripId}/expenses` | List expenses |
| PUT | `/trips/{tripId}/expenses/{expenseId}` | Edit expense |
| DELETE | `/trips/{tripId}/expenses/{expenseId}` | Delete expense |
| GET | `/trips/{tripId}/budget` | Show budget summary |

Expense payload:

```json
{
  "category": "Flights",
  "amount": 980,
  "description": "Round-trip airfare",
  "expenseDate": "2026-01-15"
}
```

## Collaboration

Trip owners can add registered users as members. Editors can update trip plans and expenses; viewers have read-only access.

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/trips/{tripId}/members` | List trip members (available to all members) |
| POST | `/trips/{tripId}/members` | Add a member (owner only) |
| PUT | `/trips/{tripId}/members/{userId}` | Change a member role (owner only) |
| DELETE | `/trips/{tripId}/members/{userId}` | Remove a member (owner only) |

Add-member payload:

```json
{
  "email": "friend@example.com",
  "role": "EDITOR"
}
```

`role` may be `EDITOR` or `VIEWER`.

## Documents

Editors and owners can upload or delete documents; all trip members can list and download them. Uploads use `multipart/form-data` with a `file` field. Supported types are PDF, JPG, PNG, DOC, and DOCX, up to 10 MB.

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/trips/{tripId}/documents` | List documents |
| POST | `/trips/{tripId}/documents` | Upload a document |
| GET | `/trips/{tripId}/documents/{documentId}/download` | Download a document |
| DELETE | `/trips/{tripId}/documents/{documentId}` | Delete a document |

## Dashboard

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/dashboard` | Number of trips, upcoming trips, total expenses, and budget remaining |
