// src/constants/addresses.js
export const STT = {
  name: "STT",
  address: "STT",
  icon: "/stt.png"
};

export const TOKEN_A = {
  name: "GOLD",
  address: "0x7e86277abbedac497e23d7abf43913833fb7ba2e",
  icon: "/gold.png"
};

export const TOKEN_B = {
  name: "GEM",
  address: "0x73f75ac5400f48bad2bff033eae4248cfef9b499",
  icon: "/gem.png"
};

export const SWAP_CONTRACT = import.meta.env.VITE_SWAP_CONTRACT;

export const TOKEN_LIST = [STT, TOKEN_A, TOKEN_B];
