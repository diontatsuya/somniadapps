import tokenLogos from "../assets/tokenLogos";

export default function TokenSelector({ label, token, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm w-10">{label}:</span>
      <select
        className="flex-1 border p-2 rounded"
        value={token.address}
        onChange={(e) => {
          const selected = Object.values(tokenLogos).find(t => t.address === e.target.value);
          onChange(selected);
        }}
      >
        {Object.values(tokenLogos).map((t) => (
          <option key={t.address} value={t.address}>
            {t.name}
          </option>
        ))}
      </select>
      <img src={token.icon} alt={token.name} className="w-6 h-6" />
    </div>
  );
}
