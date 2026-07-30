export function Keyhole({ className = "", fill = "currentColor" }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 100 130" className={className} fill={fill} xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="38" r="34" />
      <polygon points="30,60 70,60 58,110 42,110" />
    </svg>
  );
}
