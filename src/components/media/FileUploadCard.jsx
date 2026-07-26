import { useRef, useState } from "react";
import { DOCUMENT_TYPES } from "../../utils/constants";

export default function FileUploadCard({ onUpload }) {
  const fileInputRef = useRef(null);
  const [docType, setDocType] = useState(DOCUMENT_TYPES.TRAVEL_DOCUMENT);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");

  const handleFiles = async (files) => {
    const file = files?.[0];
    if (!file) return;
    setError("");
    setProgress(0);
    try {
      await onUpload(file, docType, (evt) => {
        if (evt.total) {
          setProgress(Math.round((evt.loaded / evt.total) * 100));
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Try again.");
    } finally {
      setProgress(null);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <label className="text-sm font-medium text-slate-700">
          Document type
        </label>
        <select
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          className="rounded-lg border border-slate-300 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-teal-500"
        >
          {Object.entries(DOCUMENT_TYPES).map(([key, value]) => (
            <option key={key} value={value}>
              {key.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed py-10 text-center transition ${
          isDragging
            ? "border-teal-500 bg-teal-50"
            : "border-slate-300 hover:border-teal-400"
        }`}
      >
        <span className="mb-2 text-2xl">📎</span>
        <p className="text-sm font-medium text-slate-700">
          Drop a file here, or click to browse
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Tickets, bookings, documents, or photos
        </p>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {progress !== null && (
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-teal-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}