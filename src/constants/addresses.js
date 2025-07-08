// Token addresses for Somnia testnet
export const STT = {
  address: "0x841b9fcB0c9E19Ba7eE387E9F011fe79D860d73A",
  name: "Somnia Test Token",
  symbol: "STT",
  icon: "/stt.png",
};

export const GOLD = {
  address: "0x74aF64F387c3d62b47417384392B3f84A482Ce04",
  name: "Gold Token",
  symbol: "GOLD",
  icon: "/gold.png",
};

export const GEM = {
  address: "0x84E23A21563A5189262264742ad9c395AD3E95Ae",
  name: "Gem Token",
  symbol: "GEM",
  icon: "/gem.png",
};

// All available tokens
export const TOKENS = [STT, GOLD, GEM];

// Default tokens for swap
export const TOKEN_A = GOLD;
export const TOKEN_B = GEM;

// Universal Token Swap contract address
export const SWAP_CONTRACT = "0x0c733a6cd30714e92fdfac5ef154a9c9eab5a7d2";
