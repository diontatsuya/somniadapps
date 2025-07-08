import React from "react";

export default function TokenSelector({ label, token, onChange }) {
  const handleChange = (e) => {
    const selected = tokens.find((t) => t.symbol === e.target.value);
    if (selected) {
      onChange(selected);
    }
  };

  return (
    <div className="flex flex-col">
      <label className="mb-1 font-medium">{label}</label>
      <div className="flex items-center space-x-2 border rounded p-2">
        <img src={token.icon} alt={token.symbol} className="w-6 h-6" />
        <select
          value={token.symbol}
          onChange={handleChange}
          className="flex-1 bg-transparent outline-none"
        >
          {tokens.map((t) => (
            <option key={t.symbol} value={t.symbol}>
              {t.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// Token options
const tokens = [
  {
    symbol: "GOLD",
    name: "Gold Token",
    address: import.meta.env.VITE_TOKEN_GOLD,
    icon: "/gold.png",
  },
  {
    symbol: "GEM",
    name: "Gem Token",
    address: import.meta.env.VITE_TOKEN_GEM,
    icon: "/gem.png",
  },
  {
    symbol: "STT",
    name: "Somnia Test Token",
    address: import.meta.env.VITE_TOKEN_STT,
    icon: "/stt.png",
  },
];
