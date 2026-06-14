import {
	createWalletClient,
	http,
	encodeFunctionData,
	erc20Abi,
	parseUnits,
	type Hex,
	type Address,
	parseEther,
} from "viem";
import { privateKeyToAccount, generatePrivateKey } from "viem/accounts";
import { erc7710WalletActions } from "@metamask/smart-accounts-kit/actions";
import { baseSepolia as chain } from "viem/chains";
import useFileHandler from "./useFileHandler";

const AGENT_WALLET_FILE = "userAgentDetails";

export interface AgentWalletDetails {
	privateKey: Hex;
	address: Address;
}

const useAgentWallet = () => {
	const { readFile, writeFile } = useFileHandler();

	const writeAgentWallet = (details: AgentWalletDetails) => {
		writeFile(AGENT_WALLET_FILE, JSON.stringify(details));
	};

	const readAgentWallet = (): AgentWalletDetails | false => {
		try {
			const data = readFile(AGENT_WALLET_FILE);
			if (!data?.privateKey || !data?.address) {
				throw new Error(
					`Agent wallet not found: ${AGENT_WALLET_FILE}.json is missing or invalid.`,
				);
			}
			return data as AgentWalletDetails;
		} catch (e) {
			return false;
		}
	};

	const createAgentWallet = (): AgentWalletDetails => {
		const privateKey = generatePrivateKey();
		const { address } = privateKeyToAccount(privateKey);
		const details: AgentWalletDetails = { privateKey, address };
		writeAgentWallet(details);
		return details;
	};

	const getOrCreateAgentWallet = (): AgentWalletDetails => {
		const existing = readAgentWallet();
		if (existing) return existing;
		return createAgentWallet();
	};

	const getAgentWalletClient = () => {
		const { privateKey } = getOrCreateAgentWallet();
		const account = privateKeyToAccount(privateKey);

		return createWalletClient({
			account,
			chain,
			transport: http(),
		}).extend(erc7710WalletActions());
	};

	const redeemDelegation = async ({
		permissionContext,
		delegationManager,
		to,
		data,
		value,
	}: {
		permissionContext: Hex;
		delegationManager: Address;
		to: Address;
		data: Hex;
		value?: bigint;
	}) => {
		const walletClient = getAgentWalletClient();

		const transactionHash = await walletClient.sendTransactionWithDelegation({
			to,
			data,
			value,
			permissionContext,
			delegationManager,
		});

		return transactionHash;
	};

	const redeemTokenTransfer = async ({
		permissionContext,
		delegationManager,
		tokenAddress,
		recipient,
		amount,
		decimals,
	}: {
		permissionContext: Hex;
		delegationManager: Address;
		tokenAddress: Address;
		recipient: Address;
		amount: string;
		decimals: number;
	}) => {
		const walletClient = getAgentWalletClient();

		const data = encodeFunctionData({
			abi: erc20Abi,
			functionName: "transfer",
			args: [recipient, parseUnits(amount, decimals)],
		});

		const transactionHash = await walletClient.sendTransactionWithDelegation({
			to: tokenAddress,
			data,
			permissionContext,
			delegationManager,
			gas: 500000n,
		});

		return transactionHash;
	};

	const redeemNativeTransfer = async ({
		permissionContext,
		delegationManager,
		recipient,
		amount,
	}: {
		permissionContext: Hex;
		delegationManager: Address;
		recipient: Address;
		amount: string;
	}) => {
		const walletClient = getAgentWalletClient();

		const transactionHash = await walletClient.sendTransactionWithDelegation({
			to: recipient,
			data: "0x",
			value: parseEther(amount),
			permissionContext,
			delegationManager,
			gas: 300000n,
		});

		return transactionHash;
	};

	return {
		getOrCreateAgentWallet,
		createAgentWallet,
		readAgentWallet,
		writeAgentWallet,
		getAgentWalletClient,
		redeemDelegation,
		redeemTokenTransfer,
		redeemNativeTransfer,
	};
};

export default useAgentWallet;
