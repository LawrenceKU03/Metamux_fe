import { sepolia } from "viem/chains";
import { parseUnits } from "viem";

export const erc7715NativeTokenSendSchema = (
	toDelegateTarget: string,
	amount: number,
	duration: string,
) => {
	return {
		chainId: sepolia.id,
		expiry: duration,
		to: toDelegateTarget as `0x${string}`,
		permission: {
			type: "native-token-periodic",
			data: {
				periodAmount: parseUnits(`${amount}`, 18),
				periodDuration: `${duration}`,
				justification:
					"Allows the MetaMux Agent To Execute Gasless Native Token Send Actions On Your Behalf.",
			},
			isAdjustmentAllowed: true,
		},
	};
};
