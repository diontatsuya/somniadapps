import { TOKENS } from "../constants/addresses";

export default function TokenSelector({ label, token, onChange }) {
  return (
    <div className="relative z-50">
      <label className="block mb-1 font-semibold text-sm">{label}</label>
      <select
        className="w-full border p-2 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={token?.address?.toLowerCase() || ""}
        onChange={(e) => {
          const selected = TOKENS.find(
            (t) => t.address.toLowerCase() === e.target.value.toLowerCase()
          );
          if (selected) {
            console.log("✅ Token dropdown selected:", selected.symbol);
            onChange(selected);
          } else {
            console.warn("⚠️ Tidak menemukan token dengan address:", e.target.value);
          }
        }}
      >
        {TOKENS.map((t) => (
          <option key={t.address} value={t.address.toLowerCase()}>
            {t.symbol} - {t.name}
          </option>
        ))}
      </select>

      <div className="mt-2 flex items-center space-x-2">
        <img src={token.icon} alt={token.symbol} className="w-6 h-6 rounded-full" />
        <span className="text-sm text-gray-700">
          {token.name} ({token.symbol})
        </span>
      </div>
    </div>
  );
}
