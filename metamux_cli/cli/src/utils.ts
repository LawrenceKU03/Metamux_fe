import {
	createPublicClient,
	http,
	erc20Abi,
	type Address,
	formatUnits,
} from "viem";
import { baseSepolia } from "viem/chains";

// Hardcoded symbol -> address map for Base Sepolia.
// Do NOT let an LLM populate or modify this — wrong address here
// means funds sent to/approved for the wrong contract.
const BASE_SEPOLIA_TOKENS: Record<string, `0x${string}`> = {
	USDC: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
	// add more as needed, e.g.:
	// WETH: "0x4200000000000000000000000000000000000006",
	// DAI: "0x...",
};

export function resolveTokenAddress(symbol: string): `0x${string}` | null {
	const address = BASE_SEPOLIA_TOKENS[symbol.toUpperCase()];
	return address ?? null;
}

const publicClient = createPublicClient({
	chain: baseSepolia,
	transport: http(),
});

// Cache decimals per token address — they never change for a given contract.
const decimalsCache = new Map<string, number>();

export async function getTokenDecimals(
	tokenAddress: `0x${string}`,
): Promise<number> {
	const key = tokenAddress.toLowerCase();
	if (decimalsCache.has(key)) {
		return decimalsCache.get(key)!;
	}

	const decimals = await publicClient.readContract({
		address: tokenAddress,
		abi: erc20Abi,
		functionName: "decimals",
	});

	decimalsCache.set(key, decimals);
	return decimals;
}

type BalanceSnapshot = {
	address: Address;
	nativeEth: {
		raw: string;
		formatted: string;
	};
	token: {
		address: Address;
		raw: string;
		formatted: string;
		decimals: number;
		symbol: string;
	};
};

export const getBalances = async (
	targetAddress: Address,
	targetErc20: Address,
): Promise<BalanceSnapshot> => {
	const [nativeBalance, tokenBalance, decimals, symbol] = await Promise.all([
		publicClient.getBalance({ address: targetAddress }),
		publicClient.readContract({
			address: targetErc20,
			abi: erc20Abi,
			functionName: "balanceOf",
			args: [targetAddress],
		}),
		publicClient.readContract({
			address: targetErc20,
			abi: erc20Abi,
			functionName: "decimals",
		}),
		publicClient.readContract({
			address: targetErc20,
			abi: erc20Abi,
			functionName: "symbol",
		}),
	]);

	return {
		address: targetAddress,
		nativeEth: {
			raw: nativeBalance.toString(),
			formatted: formatUnits(nativeBalance, 18),
		},
		token: {
			address: targetErc20,
			formatted: formatUnits(tokenBalance, decimals),
			raw: tokenBalance.toString(),
			decimals,
			symbol,
		},
	};
};
