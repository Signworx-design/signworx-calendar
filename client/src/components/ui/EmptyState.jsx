export default function EmptyState({ title, text }) {
  return (
    <div className="border border-dashed border-line bg-black/40 p-5 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-white">{title}</p>
      {text && <p className="mt-2 text-sm text-gray-400">{text}</p>}
    </div>
  );
}
