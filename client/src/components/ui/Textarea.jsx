export default function Textarea({ label, error, className = '', ...props }) {
  return (
    <label className="block text-left">
      {label && <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">{label}</span>}
      <textarea className={`min-h-28 w-full border border-line bg-black px-3 py-2 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-signred ${className}`} {...props} />
      {error && <span className="mt-1 block text-xs text-red-300">{error}</span>}
    </label>
  );
}
