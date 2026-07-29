export default function Card({ children, className = '' }) {
  return (
    <div className={`rounded-2xl border-white/10 bg-[#0A1A3A]/50 backdrop-blur-xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.2)] ${className}`}>
      {children}
    </div>
  );
}
