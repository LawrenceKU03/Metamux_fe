import { create } from "zustand";
import { createWalletClient, custom } from "viem";
import { baseSepolia } from "viem/chains";
import { erc7715ProviderActions } from "@metamask/smart-accounts-kit/actions";

type UseEOAUpgradeProps = {
	isUpgraded: boolean;
	upgradeStatus: "idle" | "upgrading" | "upgraded" | "failed";
	activePrivyEVMWallet: any | null;
	permissionContext: any | null;
	setActivePrivyWallet: (_activePrivyWallet: any) => void;
	initUpgrade: (erc7715Payload: any) => Promise<void>;
};

const useEOAUpgrade = create<UseEOAUpgradeProps>((set, get) => ({
	activePrivyEVMWallet: null,
	upgradeStatus: "idle",
	isUpgraded: false,
	permissionContext: null,

	setActivePrivyWallet: (_activePrivyWallet: any) => {
		set({ activePrivyEVMWallet: _activePrivyWallet });
	},

	initUpgrade: async (erc7715Payload: any) => {
		const { activePrivyEVMWallet } = get();

		if (!activePrivyEVMWallet) {
			console.error(
				"Upgrade aborted: No active Privy wallet assigned to store.",
			);
			set({ upgradeStatus: "failed" });
			return;
		}

		set({ upgradeStatus: "upgrading" });

		try {
			const ethereumProvider = await activePrivyEVMWallet.getEthereumProvider();

			// Fixed: changed self-referential token invocation back to createWalletClient
			// Fixed: clean standard object method signature mapping for custom transport
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
			}).extend(erc7715ProviderActions());

			const grantedPermissions = await walletClient.requestExecutionPermissions(
				[erc7715Payload],
			);

			console.log(
				"Permissions successfully granted by MetaMask:",
				grantedPermissions[0],
			);

			set({
				isUpgraded: true,
				upgradeStatus: "upgraded",
				permissionContext: grantedPermissions[0],
			});
		} catch (error) {
			console.error("Advanced Permission upgrade handoff failed:", error);
			set({
				isUpgraded: false,
				upgradeStatus: "failed",
			});
		}
	},
}));

export default useEOAUpgrade;
