export const universalTokenSwapAbi = [
  {
    inputs: [
      { internalType: "address", name: "fromToken", type: "address" },
      { internalType: "address", name: "toToken", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "swap",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    name: "estimateSwap",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "pure",
    type: "function"
  }
];
