export default function Select({ label, error, children, className = '', ...props }) {
  return (
    <label className="block text-left">
      {label && <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">{label}</span>}
      <select className={`w-full border border-line bg-black px-3 py-2 text-sm text-white outline-none transition focus:border-signred ${className}`} {...props}>
        {children}
      </select>
      {error && <span className="mt-1 block text-xs text-red-300">{error}</span>}
    </label>
  );
}
