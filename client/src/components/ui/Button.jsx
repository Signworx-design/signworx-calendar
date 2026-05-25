export default function Button({ variant = 'primary', className = '', type = 'button', ...props }) {
  const variants = {
    primary: 'bg-signred text-white hover:bg-signredDark border-signred',
    secondary: 'bg-steel text-white hover:border-signred border-line',
    ghost: 'bg-transparent text-gray-200 hover:text-white border-transparent',
    danger: 'bg-transparent text-red-200 border-signred hover:bg-signredDark',
  };
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 border px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
