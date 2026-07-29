import React from 'react';

const baseClass = "w-full bg-white/5 border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50 [color-scheme:dark]";
const labelClass = "block text-xs font-semibold text-white/80 mb-1";

export default function FormInput({ label, as = 'input', error, className = '',...props }) {
  const Component = as;
  return (
    <div>
      {label && <label className={labelClass}>{label}</label>}
      <Component {...props} className={`${baseClass} ${as === 'textarea'? 'min-h-[50px] resize-none' : ''} ${className}`} >
        {props.children}
      </Component>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}
