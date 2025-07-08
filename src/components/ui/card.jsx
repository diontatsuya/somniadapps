// src/components/ui/card.jsx

export function Card({ className = "", children }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-2xl shadow p-4 ${className}`}>
      {children}
    </div>
  );
}
