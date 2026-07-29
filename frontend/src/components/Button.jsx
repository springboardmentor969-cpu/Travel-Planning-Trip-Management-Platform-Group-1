export default function Button({ children, variant = 'primary', className = '', type = 'button', ...props }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60";

  const variants = {
    primary: 'bg-gradient-to-r from-amber-500 to-teal-500 text-[#050A18] shadow-lg shadow-amber-500/30 hover:opacity-90 hover:scale-105',
    secondary: 'bg-white/5 text-white border-white/10 hover:bg-white/10 backdrop-blur',
    danger: 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30',
    ghost: 'text-white/40 hover:text-white hover:bg-white/5'
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
