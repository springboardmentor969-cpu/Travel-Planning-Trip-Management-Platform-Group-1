import { useState } from "react";

export default function InviteMemberForm({ onInvite }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!email) {
      setError("Enter an email address.");
      return;
    }
    setIsSubmitting(true);
    try {
      await onInvite(email);
      setMessage(`Invitation sent to ${email}.`);
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not send the invite.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        placeholder="friend@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-60"
      >
        {isSubmitting ? "Sending…" : "Invite"}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {message && <p className="text-xs text-green-600">{message}</p>}
    </form>
  );
}