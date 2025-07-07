export function Button({ children, className = "", variant = "default", ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-black hover:bg-gray-300",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-300 text-black hover:bg-gray-100",
  };

  return (
    <button
      className={`${base} ${variants[variant] || ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
