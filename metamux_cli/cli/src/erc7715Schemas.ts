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
