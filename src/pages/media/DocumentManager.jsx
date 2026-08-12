import { useEffect, useState } from "react";
import mediaApi from "../../api/mediaApi";
import FileUploadCard from "../../components/media/FileUploadCard";
import DocumentList from "../../components/media/DocumentList";

export default function DocumentManager({ tripId }) {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDocuments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await mediaApi.getDocuments(tripId);
      setDocuments(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load documents.");
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  const handleUpload = async (file, type, onProgress) => {
    try {
      await mediaApi.uploadDocument(tripId, file, type, onProgress);
      await loadDocuments();
    } catch (err) {
      alert(err?.response?.data?.message || "File upload failed.");
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm("Delete this document?")) return;
    try {
      await mediaApi.deleteDocument(tripId, documentId);
      setDocuments((prev) => prev.filter((d) => d.id !== documentId));
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete document.");
    }
  };

  const handleDownload = async (doc) => {
    try {
      const fileName = doc.name || doc.fileName || "document";
      await mediaApi.downloadDocument(tripId, doc.id, fileName);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to download document.");
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 px-5 py-4">
        <div>
          <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
            📄 Media & Documents
          </h2>
          <p className="text-xs text-slate-500">
            Secure travel tickets, hotel bookings, and documents
          </p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm">
          {documents.length} File{documents.length !== 1 ? "s" : ""}
        </span>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-5">
        <FileUploadCard onUpload={handleUpload} />
        <div>
          {isLoading ? (
            <p className="py-10 text-center text-sm text-slate-400">
              Loading documents…
            </p>
          ) : (
            <DocumentList
              documents={documents}
              onDelete={handleDelete}
              onDownload={handleDownload}
            />
          )}
        </div>
      </div>
    </div>
  );
}