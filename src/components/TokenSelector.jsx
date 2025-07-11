import { TOKENS } from "../constants/addresses";

export default function TokenSelector({ label, token, onChange, otherToken }) {
  return (
    <div className="z-10 relative">
      <label className="block mb-1 font-medium text-sm text-gray-700">{label}</label>

      <select
        value={token.address}
        onChange={(e) => {
          const selected = TOKENS.find((t) => t.address === e.target.value);
          if (selected && selected.address !== otherToken?.address) {
            onChange(selected);
          }
        }}
        className="w-full border p-2 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {TOKENS.map((t) => (
          <option
            key={t.address}
            value={t.address}
            disabled={t.address === otherToken?.address}
          >
            {t.symbol} - {t.name}
          </option>
        ))}
      </select>

      <div className="mt-2 flex items-center space-x-2">
        <img src={token.icon} alt={token.symbol} className="w-6 h-6 rounded-full" />
        <span className="text-sm text-gray-800 font-medium">
          {token.name} ({token.symbol})
        </span>
      </div>
    </div>
  );
}
