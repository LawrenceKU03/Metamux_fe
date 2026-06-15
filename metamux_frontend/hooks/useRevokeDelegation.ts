// store/useRevokeDelegation.ts
import { create } from "zustand";
import { createWalletClient, custom, encodeFunctionData } from "viem";
import { baseSepolia } from "viem/chains";
import { disableDelegationAbi } from "../abi/disableDelegationABIFragment";

type Caveat = {
  enforcer: `0x${string}`;
  terms: `0x${string}`;
  args: `0x${string}`;
};

type Delegation = {
  delegate: `0x${string}`;
  delegator: `0x${string}`;
  authority: `0x${string}`;
  caveats: Caveat[];
  salt: bigint;
  signature: `0x${string}`;
};

const DELEGATION_MANAGER_ADDRESS = "0x..." as `0x${string}`; // your DelegationManager on baseSepolia

type UseRevokeDelegationProps = {
  revokeStatus: "idle" | "revoking" | "revoked" | "failed";
  activePrivyEVMWallet: any | null;
  delegationToRevoke: Delegation | null;
  txHash: `0x${string}` | null;
  setActivePrivyWallet: (_activePrivyWallet: any) => void;
  setDelegationToRevoke: (_delegation: Delegation) => void;
  initRevoke: () => Promise<void>;
};

const useRevokeDelegation = create<UseRevokeDelegationProps>((set, get) => ({
  activePrivyEVMWallet: null,
  revokeStatus: "idle",
  delegationToRevoke: null,
  txHash: null,

  setActivePrivyWallet: (_activePrivyWallet: any) => {
    set({ activePrivyEVMWallet: _activePrivyWallet });
  },

  setDelegationToRevoke: (_delegation: Delegation) => {
    set({ delegationToRevoke: _delegation });
  },

  initRevoke: async () => {
    const { activePrivyEVMWallet, delegationToRevoke } = get();

    if (!activePrivyEVMWallet) {
      console.error(
        "Revoke aborted: No active Privy wallet assigned to store.",
      );
      set({ revokeStatus: "failed" });
      return;
    }
    if (!delegationToRevoke) {
      console.error("Revoke aborted: No delegation set to revoke.");
      set({ revokeStatus: "failed" });
      return;
    }

    set({ revokeStatus: "revoking" });

    try {
      const ethereumProvider = await activePrivyEVMWallet.getEthereumProvider();

      const walletClient = createWalletClient({
        account: activePrivyEVMWallet.address as `0x${string}`,
        chain: baseSepolia,
        transport: custom({
          async request({ method, params }: any) {
            if (method === "chainId") {
              return await ethereumProvider.request({ method: "eth_chainId" });
            }
            return await ethereumProvider.request({ method, params });
          },
        }),
      });

      const data = encodeFunctionData({
        abi: disableDelegationAbi,
        functionName: "disableDelegation",
        args: [delegationToRevoke],
      });

      const txHash = await walletClient.sendTransaction({
        to: DELEGATION_MANAGER_ADDRESS,
        data,
      });

      console.log("Delegation revoke tx sent:", txHash);

      set({
        revokeStatus: "revoked",
        txHash,
      });
    } catch (error) {
      console.error("Delegation revoke failed:", error);
      set({
        revokeStatus: "failed",
      });
    }
  },
}));

export default useRevokeDelegation;
