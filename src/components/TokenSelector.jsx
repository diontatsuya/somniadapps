import React from "react";

export default function TokenSelector({ label, token, onChange }) {
  const options = [
    {
      name: "STT",
      address: "0x0000000000000000000000000000000000000000", // ganti dengan alamat STT sebenarnya jika perlu
      icon: "/stt.png",
    },
    {
      name: "GOLD",
      address: "0x7e86277abbedac497e23d7abf43913833fb7ba2e",
      icon: "/gold.png",
    },
    {
      name: "GEM",
      address: "0x73f75ac5400f48bad2bff033eae4248cfef9b499",
      icon: "/gem.png",
    },
  ];

  return (
    <div className="flex flex-col">
      <label className="text-sm font-semibold mb-1">{label}</label>
      <select
        className="border p-2 rounded"
        value={token.address}
        onChange={(e) => {
          const selected = options.find((opt) => opt.address === e.target.value);
          onChange(selected);
        }}
      >
        {options.map((opt) => (
          <option key={opt.address} value={opt.address}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
}
