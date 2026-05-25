export default function Card({ children, className = '' }) {
  return <section className={`border border-line bg-coal p-4 shadow-redline ${className}`}>{children}</section>;
}
