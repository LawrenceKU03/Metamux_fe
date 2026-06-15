// abi/delegationManager.ts
export const disableDelegationAbi = [
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "delegate", type: "address" },
          { internalType: "address", name: "delegator", type: "address" },
          { internalType: "bytes32", name: "authority", type: "bytes32" },
          {
            components: [
              { internalType: "address", name: "enforcer", type: "address" },
              { internalType: "bytes", name: "terms", type: "bytes" },
              { internalType: "bytes", name: "args", type: "bytes" },
            ],
            internalType: "struct Caveat[]",
            name: "caveats",
            type: "tuple[]",
          },
          { internalType: "uint256", name: "salt", type: "uint256" },
          { internalType: "bytes", name: "signature", type: "bytes" },
        ],
        internalType: "struct Delegation",
        name: "_delegation",
        type: "tuple",
      },
    ],
    name: "disableDelegation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
