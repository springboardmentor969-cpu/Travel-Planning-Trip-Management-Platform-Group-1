const TYPE_ICONS = {
  TICKET: "🎫",
  HOTEL_BOOKING: "🏨",
  TRAVEL_DOCUMENT: "📄",
  PHOTO: "🖼️",
  OTHER: "📁",
};

function formatFileSize(bytes) {
  if (!bytes) return "";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export default function DocumentList({ documents, onDelete }) {
  if (!documents || documents.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-300 py-10 text-center text-sm text-slate-400">
        No documents uploaded yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm"
        >
          <span className="text-2xl">{TYPE_ICONS[doc.type] || "📁"}</span>
          <div className="min-w-0 flex-1">
            <a
              href={doc.url}
              target="_blank"
              rel="noreferrer"
              className="block truncate text-sm font-medium text-slate-900 hover:text-teal-600"
            >
              {doc.name}
            </a>
            <p className="text-xs text-slate-400">
              {formatFileSize(doc.sizeBytes)}
              {doc.uploadedAt &&
                ` · ${new Date(doc.uploadedAt).toLocaleDateString("en-IN")}`}
            </p>
          </div>
          <button
            onClick={() => onDelete(doc.id)}
            className="shrink-0 text-xs font-medium text-slate-400 hover:text-red-500"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}