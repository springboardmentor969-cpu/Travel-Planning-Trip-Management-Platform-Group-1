export const TRIP_STATUS = {
  PLANNING: "PLANNING",
  UPCOMING: "UPCOMING",
  ONGOING: "ONGOING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

export const TRIP_STATUS_LABELS = {
  [TRIP_STATUS.PLANNING]: "Planning",
  [TRIP_STATUS.UPCOMING]: "Upcoming",
  [TRIP_STATUS.ONGOING]: "Ongoing",
  [TRIP_STATUS.COMPLETED]: "Completed",
  [TRIP_STATUS.CANCELLED]: "Cancelled",
};

export const TRIP_STATUS_COLORS = {
  [TRIP_STATUS.PLANNING]: "bg-amber-100 text-amber-700",
  [TRIP_STATUS.UPCOMING]: "bg-blue-100 text-blue-700",
  [TRIP_STATUS.ONGOING]: "bg-teal-100 text-teal-700",
  [TRIP_STATUS.COMPLETED]: "bg-slate-200 text-slate-600",
  [TRIP_STATUS.CANCELLED]: "bg-red-100 text-red-700",
};

export const ACTIVITY_TYPES = [
  "SIGHTSEEING",
  "TRANSPORTATION",
  "ACCOMMODATION",
  "DINING",
  "ADVENTURE_ACTIVITIES",
  "SHOPPING",
];

export const ACTIVITY_TYPE_LABELS = {
  SIGHTSEEING: "Sightseeing",
  TRANSPORTATION: "Transportation",
  ACCOMMODATION: "Accommodation",
  DINING: "Dining",
  ADVENTURE_ACTIVITIES: "Adventure Activities",
  SHOPPING: "Shopping",
};

export const ACTIVITY_TYPE_ICONS = {
  SIGHTSEEING: "🗺️",
  TRANSPORTATION: "🚗",
  ACCOMMODATION: "🏨",
  DINING: "🍽️",
  ADVENTURE_ACTIVITIES: "🧗",
  SHOPPING: "🛍️",
};

export const EXPENSE_CATEGORIES = [
  "TRANSPORTATION",
  "HOTEL",
  "FOOD",
  "SHOPPING",
  "ENTERTAINMENT",
  "MISCELLANEOUS",
];

export const EXPENSE_CATEGORY_LABELS = {
  TRANSPORTATION: "Transportation",
  HOTEL: "Hotel",
  FOOD: "Food",
  SHOPPING: "Shopping",
  ENTERTAINMENT: "Entertainment",
  MISCELLANEOUS: "Miscellaneous",
};

export const EXPENSE_CATEGORY_COLORS = {
  TRANSPORTATION: "#0d9488",
  HOTEL: "#7c3aed",
  FOOD: "#f59e0b",
  SHOPPING: "#ec4899",
  ENTERTAINMENT: "#3b82f6",
  MISCELLANEOUS: "#64748b",
};

export const GROUP_MEMBER_ROLES = {
  OWNER: "OWNER",
  GROUP_ADMIN: "GROUP_ADMIN",
  MEMBER: "MEMBER",
};

export const NOTIFICATION_TYPES = {
  TRIP_REMINDER: "TRIP_REMINDER",
  ACTIVITY_REMINDER: "ACTIVITY_REMINDER",
  BUDGET_ALERT: "BUDGET_ALERT",
  GROUP_INVITATION: "GROUP_INVITATION",
  TRAVEL_UPDATE: "TRAVEL_UPDATE",
  SYSTEM: "SYSTEM",
};

export const DOCUMENT_TYPES = {
  TICKET: "TICKET",
  HOTEL_BOOKING: "HOTEL_BOOKING",
  TRAVEL_DOCUMENT: "TRAVEL_DOCUMENT",
  PHOTO: "PHOTO",
  OTHER: "OTHER",
};

export function formatCurrency(amount, currency = "INR") {
  const value = Number(amount || 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateShort(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}