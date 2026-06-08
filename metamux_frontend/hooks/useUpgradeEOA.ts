import { create } from "zustand";
import { createWalletClient, custom, parseUnits } from "viem";
import { baseSepolia } from "viem/chains";
import { erc7715ProviderActions } from "@metamask/smart-accounts-kit/actions";
import { erc7710RedeemActions } from "@metamask/smart-accounts-kit/actions";

type UseEOAUpgradeProps = {
	isUpgraded: boolean;
	upgradeStatus: "idle" | "upgrading" | "upgraded" | "failed";
	activePrivyEVMWallet: any | null;
	permissionContext: any | null;
	setActivePrivyWallet: (_activePrivyWallet: any) => void;
	initUpgrade: () => Promise<void>;
};

const useEOAUpgrade = create<UseEOAUpgradeProps>((set, get) => ({
	activePrivyEVMWallet: null,
	upgradeStatus: "idle",
	isUpgraded: false,
	permissionContext: null,

	setActivePrivyWallet: (_activePrivyWallet: any) => {
		set({ activePrivyEVMWallet: _activePrivyWallet });
	},

	initUpgrade: async () => {
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

			const sessionExpiryEpoch =
				Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // 1 week duration
			const agentSessionAccountAddress =
				"0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

			console.log("Routing clear requestExecutionPermissions call...");

			const grantedPermissions = await walletClient.requestExecutionPermissions(
				[
					{
						chainId: baseSepolia.id,
						expiry: sessionExpiryEpoch,
						to: agentSessionAccountAddress as `0x${string}`,
						permission: {
							type: "native-token-periodic",
							data: {
								periodAmount: parseUnits("0.5", 18),
								periodDuration: 86400,
								justification:
									"Allows the MetaMux Agent to execute gasless actions on your behalf.",
							},
							isAdjustmentAllowed: false,
						},
					},
				],
			);

			console.log(
				"Permissions successfully granted by MetaMask:",
				grantedPermissions,
			);

			set({
				isUpgraded: true,
				upgradeStatus: "upgraded",
				permissionContext: grantedPermissions,
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
