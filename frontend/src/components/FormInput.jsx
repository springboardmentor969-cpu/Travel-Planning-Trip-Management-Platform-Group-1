export default function FormInput({ label, as = 'input', className = '', ...props }) {
  const Element = as;
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <Element
        className={`w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${className}`}
        {...props}
      />
    </label>
  );
}
