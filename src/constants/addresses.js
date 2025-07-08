// src/constants/addresses.js

export const SWAP_CONTRACT = "0x0c733a6cd30714e92fdfac5ef154a9c9eab5a7d2";

export const STT = {
  address: "0x9F8ac5C650a1AD4740f5Fe4acC63f2AfA7995294",
  name: "STT",
  symbol: "STT",
  icon: "/stt.png",
};

export const GOLD = {
  address: "0x9D1bBA3eB2F3B057BDCe73eCa609Ff7Dccf36Ec4",
  name: "Gold",
  symbol: "GOLD",
  icon: "/gold.png",
};

export const GEM = {
  address: "0xF0A2b09C1890d1521e60e46245a8687AbEe60270",
  name: "Gem",
  symbol: "GEM",
  icon: "/gem.png",
};

// Daftar token yang tersedia untuk dipilih dalam swap
export const TOKENS = [STT, GOLD, GEM];

// Default dari dan ke token
export const TOKEN_A = GOLD;
export const TOKEN_B = GEM;
