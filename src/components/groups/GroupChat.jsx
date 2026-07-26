import { useState } from "react";

export default function GroupChat({ messages, currentUserId, onSend }) {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setIsSending(true);
    try {
      await onSend(text.trim());
      setText("");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-96 flex-col rounded-2xl bg-white shadow-sm">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="py-10 text-center text-sm text-slate-400">
            No messages yet — say hello to the group.
          </p>
        )}
        {messages.map((msg) => {
          const isMine = msg.author?.id === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                  isMine
                    ? "bg-teal-600 text-white"
                    : "bg-slate-100 text-slate-800"
                }`}
              >
                {!isMine && (
                  <p className="mb-0.5 text-xs font-medium text-teal-700">
                    {msg.author?.name}
                  </p>
                )}
                <p>{msg.message}</p>
              </div>
            </div>
          );
        })}
      </div>
      <form
        onSubmit={handleSend}
        className="flex gap-2 border-t border-slate-100 p-3"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message the group…"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          type="submit"
          disabled={isSending}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-60"
        >
          Send
        </button>
      </form>
    </div>
  );
}