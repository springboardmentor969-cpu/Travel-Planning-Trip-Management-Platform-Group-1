import { useEffect, useState } from "react";
import mediaApi from "../../api/mediaApi";
import FileUploadCard from "../../components/media/FileUploadCard";
import DocumentList from "../../components/media/DocumentList";

export default function DocumentManager({ tripId }) {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const data = await mediaApi.getDocuments(tripId);
      setDocuments(data);
    } catch (err) {
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
    await mediaApi.uploadDocument(tripId, file, type, onProgress);
    await loadDocuments();
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm("Delete this document?")) return;
    await mediaApi.deleteDocument(tripId, documentId);
    setDocuments((prev) => prev.filter((d) => d.id !== documentId));
  };

  return (
    <div>
      <div className="mb-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 px-5 py-4">
        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
          📄 Media & Documents
        </h2>
        <p className="text-xs text-slate-500">
          {documents.length} file{documents.length !== 1 ? "s" : ""} uploaded
        </p>
      </div>

      <div className="space-y-5">
        <FileUploadCard onUpload={handleUpload} />
        <div>
          {isLoading ? (
            <p className="py-10 text-center text-sm text-slate-400">
              Loading documents…
            </p>
          ) : (
            <DocumentList documents={documents} onDelete={handleDelete} />
          )}
        </div>
      </div>
    </div>
  );
}