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

export default function DocumentList({ documents, onDelete, onDownload }) {
  if (!documents || documents.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 py-10 text-center">
        <span className="mb-2 text-2xl">📄</span>
        <p className="text-sm font-medium text-slate-600">No documents uploaded yet</p>
        <p className="text-xs text-slate-400">Upload travel tickets, hotel reservations, or IDs above.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {documents.map((doc) => {
        const docName = doc.name || doc.fileName || "Document";
        const docType = doc.type || doc.fileType || "OTHER";
        const docSize = doc.sizeBytes || doc.fileSize;

        return (
          <div
            key={doc.id}
            className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm transition hover:shadow-md"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-xl">
              {TYPE_ICONS[docType] || "📁"}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900" title={docName}>
                {docName}
              </p>
              <p className="text-xs text-slate-400">
                {formatFileSize(docSize)}
                {doc.uploadedAt &&
                  ` · ${new Date(doc.uploadedAt).toLocaleDateString("en-IN")}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {onDownload && (
                <button
                  onClick={() => onDownload(doc)}
                  className="rounded-lg bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700 hover:bg-teal-100"
                >
                  Download
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(doc.id)}
                  className="rounded-lg px-2 py-1 text-xs font-medium text-slate-400 hover:bg-red-50 hover:text-red-500"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}