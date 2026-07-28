export default function Button({ children, variant = 'primary', className = '', type = 'button', ...props }) {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white shadow-lg shadow-blue-200/70 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-200/80',
    secondary: 'border border-slate-200 bg-white/80 text-slate-700 shadow-sm backdrop-blur hover:border-slate-300 hover:bg-white hover:-translate-y-0.5',
    danger: 'border border-red-100 bg-red-50 text-red-700 hover:bg-red-100',
    ghost: 'text-slate-600 hover:bg-slate-100/80'
  };

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
