import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-800 to-slate-900 px-4 text-center text-white">
      <span className="mb-2 text-5xl">🔒</span>
      <h1 className="text-2xl font-semibold">
        You don't have access to this page
      </h1>
      <p className="text-slate-300">
        Your account role doesn't include this section.
      </p>
      <Link
        to="/dashboard"
        className="mt-4 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
      >
        Back to dashboard
      </Link>
    </div>
  );
}