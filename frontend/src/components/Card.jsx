export default function Card({ children, className = '' }) {
  return <div className={`rounded-3xl border border-white/60 bg-white/80 p-5 shadow-soft backdrop-blur-sm ${className}`}>{children}</div>;
}