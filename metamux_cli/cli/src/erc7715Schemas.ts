import { baseSepolia } from "viem/chains";
import { parseUnits, toHex } from "viem";

export const erc7715NativeTokenSendSchema = (
	toDelegateTarget: string,
	amount: number,
	duration: string,
) => {
	return {
		chainId: baseSepolia.id,
		expiry: parseInt(duration),
		to: toDelegateTarget as `0x${string}`,
		permission: {
			type: "native-token-periodic",
			data: {
				periodAmount: toHex(parseUnits(`${amount}`, 18)),
				periodDuration: parseInt(`60`), //cool down between tx
				justification:
					"Allows the MetaMux Agent To Execute Gasless Native Token Send Actions On Your Behalf.",
			},
			isAdjustmentAllowed: true,
		},
	};
};

export const erc7715Erc20SendSchema = (
	toDelegateTarget: string,
	tokenAddress: string,
	amount: number,
	decimals: number,
	duration: string,
) => {
	return {
		chainId: baseSepolia.id,
		expiry: parseInt(duration),
		to: toDelegateTarget as `0x${string}`,
		permission: {
			type: "erc20-token-periodic",
			data: {
				tokenAddress: tokenAddress as `0x${string}`,
				periodAmount: toHex(parseUnits(`${amount}`, decimals)),
				periodDuration: parseInt(`60`), //cool down between tx
				justification:
					"Allows the MetaMux Agent To Execute Gasless ERC-20 Token Send Actions On Your Behalf.",
			},
			isAdjustmentAllowed: true,
		},
	};
};

// Base Sepolia USDC convenience wrapper
export const erc7715UsdcSendSchema = (
	toDelegateTarget: string,
	amount: number,
	duration: string,
) => {
	const BASE_SEPOLIA_USDC = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
	return erc7715Erc20SendSchema(
		toDelegateTarget,
		BASE_SEPOLIA_USDC,
		amount,
		6, // USDC decimals
		duration,
	);
};
