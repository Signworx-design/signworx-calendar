import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './Button';

export default function Modal({ open, title, children, onClose, wide = false }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 px-4 py-6 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className={`w-full border border-line bg-coal shadow-2xl ${wide ? 'max-w-5xl' : 'max-w-2xl'}`}>
        <header className="flex items-center justify-between border-b border-signred/60 bg-black px-4 py-3">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">{title}</h2>
          <Button variant="ghost" onClick={onClose} className="px-2" aria-label="Close"><X size={18} /></Button>
        </header>
        <div className="p-4">{children}</div>
      </motion.div>
    </div>
  );
}
