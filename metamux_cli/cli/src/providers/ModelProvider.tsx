import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import type { Model } from "../models";
import type { ReactNode } from "react";
import useFileHandler from "../hooks/useFileHandler";
import { parseEther } from "viem";
const BASE_URL_VENICE = "https://api.venice.ai/api/v1";
const API_KEY_VENICE =
	"VENICE_INFERENCE_KEY_-Yfvoqe8GmiLEklEvzh6UofHgEWUe2jQK54u2Ye5v3";

import OpenAI from "openai";
import useDetectOnchainIntent from "../hooks/useDetectOnchainIntent";
import { erc7715NativeTokenSendSchema } from "../erc7715Schemas";
import useEncryptionHandler from "../hooks/useEncryptionHandler";
import useAgentWallet from "../hooks/useAgentWallet";
import useDetectHexPayload from "../hooks/useDetectHexPayload";

const client = new OpenAI({
	apiKey: API_KEY_VENICE,
	baseURL: BASE_URL_VENICE,
	dangerouslyAllowBrowser: true,
});

export type ModelContextProps = {
	activeModel: Model;
	agentStatus: string;
	activeSessionTitle: string;
	activeSessionManager: SessionManager;
	setActiveAgentModel: (item: Model) => void;
	setActiveSessionTitle: (title: string) => void;
	InteractWithAgent: (text: string, prompt?: string) => void;
	push: (message: SessionMessage) => void;
	titleSession: () => void;
	saveSession: () => void;
};

const ModelProviderContext = createContext<ModelContextProps | null>(null);

export const useModelContext = () => {
	const value = useContext(ModelProviderContext);
	if (!value) {
		throw new Error("useModelContext must be used within a ModelProvider");
	}
	return value;
};

type ModelProviderProps = {
	children: ReactNode;
};

export type SessionMessage = {
	content: string;
	role: "USER" | "BOT" | "ERROR";
	model?: string;
};

export type Session = {
	title: string;
	messages: SessionMessage[];
};

export type SessionManager = {
	activeSession: Session | null;
	sessions: Session[];
};

export const ModelProvider = ({ children }: ModelProviderProps) => {
	const [activeAgentModel, setActiveModel] = useState<Model>({
		id: "e2ee-venice-uncensored",
		name: "Venice Uncensored 1.1",
		contextWindow: 32000,
	});
	const [agentStatus, setAgentStatus] = useState<string>("Idle");
	const [activeSessionTitle, setActiveSessionTitle] =
		useState<string>("session001");

	const [activeSessionManager, setActiveSession] = useState<SessionManager>({
		activeSession: {
			title: activeSessionTitle,
			messages: [],
		},
		sessions: [],
	});

	const { writeFile, readFile } = useFileHandler();

	useEffect(() => {
		try {
			const savedSessionManager: SessionManager =
				readFile("UserSessionMetamux");
			activeSessionManager.sessions.push(...savedSessionManager.sessions);
			const activeSession = activeSessionManager.sessions.filter(
				(session) => session.title == activeSessionTitle,
			);

			if (activeSession.length > 0) {
				setActiveSession({
					activeSession: activeSession[0] as Session,
					sessions: activeSessionManager.sessions.filter(
						(s) => s.title !== activeSessionTitle,
					),
				});
			} else {
				setActiveSession({
					activeSession: {
						title: activeSessionTitle,
						messages: [],
					},
					sessions: [],
				});
			}
		} catch { }
	}, []);

	const titleSession = () => {
		if (!activeSessionManager.activeSession) {
			return;
		}

		const messages = JSON.stringify([
			activeSessionManager.activeSession.messages.map((msg) => msg.content),
		]);

		//added agent code to generate title for the session
	};

	const saveSession = () => {
		if (!activeSessionManager.activeSession) return;
		const currentSession: Session = {
			title: activeSessionTitle,
			messages: activeSessionManager.activeSession.messages,
		};
		const updatedSessions = [...activeSessionManager.sessions, currentSession];

		writeFile(
			"UserSessionMetamux",
			JSON.stringify({
				activeSession: [],
				sessions: updatedSessions,
			}),
		);
	};

	const push = useCallback((message: SessionMessage) => {
		if (!activeSessionManager.activeSession) {
			return;
		}
		setActiveSession((prev) => {
			if (!prev.activeSession) return prev;
			return {
				...prev,
				activeSession: {
					...prev.activeSession,
					messages: [...prev.activeSession.messages, message],
				},
			};
		});
	}, []);

	const setActiveAgentModel = useCallback(
		(item: Model) => {
			setActiveModel(item);
		},
		[setActiveModel],
	);

	const { createToken, readToken } = useEncryptionHandler();
	const { getOrCreateAgentWallet, readAgentWallet, redeemNativeTransfer } =
		useAgentWallet();

	const InteractWithAgent = useCallback(
		async (text: string, prompt?: string) => {
			setAgentStatus("Parsing");

			const cleanedOutMessages: Array<{
				role: "system" | "user" | "assistant";
				content: string;
			}> = [];

			if (prompt) {
				cleanedOutMessages.push({ role: "system", content: prompt });
			}

			activeSessionManager.activeSession?.messages.forEach((msg) => {
				if (msg.role === "USER") {
					cleanedOutMessages.push({ role: "user", content: msg.content });
				} else if (msg.role === "BOT") {
					cleanedOutMessages.push({ role: "assistant", content: msg.content });
				}
			});

			if (useDetectHexPayload(text)) {
				const textInfo = readToken(text);

				//const delegStash = readFile("delegationsStash.json");
				writeFile(`agentCurrentDelegation.json`, JSON.stringify(textInfo));

				const res = await client.chat.completions.create({
					model: activeAgentModel.id,
					messages: [
						{
							role: "user",
							content: `${JSON.stringify(textInfo)} Interpret this ERC-7715 permission grant JSON and explain in plain English what authority it delegates: the permission type, the exact amount/rate the agent can spend (convert from wei), the time window (period duration and expiry, converted from unix timestamps), which addresses are involved (delegator, delegate/agent), and any conditions or limits — phrased as "this lets the agent do X for Y duration up to Z amount." as no '**' or bolden of any text and keep it under 250 characters capitalize meaning turn "this is" to "This Is" turn the first letter of each word to a Uppercase your reply NOTE: we time is in seconds so turn the seconds into hours or minutes and the periodDuration(the cool down time between transactions the user sent and it is not automatic) is 60 SECONDS`,
						},
					],
				});
				const reply = res.choices[0]?.message?.content ?? "No response";

				push({
					role: "BOT",
					content: `NEW AGENT CAPABILITIES\n\n${reply}`,
					model: activeAgentModel.name,
				});
				setAgentStatus("Idle");
				return;
			}

			if (
				["swap", "send", "transfer", "balance", "wallet address"].some(
					(keyword) => text.includes(keyword),
				)
			) {
				cleanedOutMessages.push({ role: "user", content: text });
				const res_json = await useDetectOnchainIntent(text, activeAgentModel);
				const delegationCache = readFile("agentCurrentDelegation.json");

				const requestedWei = parseEther(String(res_json.amount)).toString();
				const periodAmount = delegationCache.permission.data.periodAmount;
				const expiryTimestamp = delegationCache.rules?.find(
					(r) => r.type === "expiry",
				)?.data?.timestamp;
				const startTime = delegationCache.permission.data.startTime;
				const now = Math.floor(Date.now() / 1000);

				const res = await client.chat.completions.create({
					model: activeAgentModel.id,
					messages: [
						{
							role: "user",
							content: `You are validating a transaction against an on-chain spending delegation.

Delegation allows:
- Type: ${delegationCache.permission.type}
- Max amount per period: ${periodAmount} wei
- Period duration: ${delegationCache.permission.data.periodDuration} seconds
- Valid from (unix): ${startTime}
- Expires (unix): ${expiryTimestamp}
- Justification: "${delegationCache.permission.data.justification}"

Current time (unix): ${now}

Requested transaction:
- Action: "${text}"
- Amount: ${requestedWei} wei
- Recipient: ${res_json.targetAddress}

Rules:
1. Requested amount (${requestedWei}) must be <= max amount per period (${periodAmount}).
2. Current time (${now}) must be >= valid from (${startTime}) and <= expires (${expiryTimestamp}).
3. The action type must match what the delegation's justification permits (e.g. a native ETH send matches "native token send" justifications).

Respond with ONLY the word "true" if ALL rules pass, or "false" if ANY rule fails. No other text.`,
						},
					],
				});

				const reply = res.choices[0]?.message?.content ?? "No response";

				if (reply.toLowerCase() == "true") {
					try {
						const txhash = await redeemNativeTransfer({
							recipient: res_json.targetAddress,
							amount: res_json.amount,
							delegationManager: delegationCache.delegationManager,
							permissionContext: delegationCache.context,
						});
						push({
							role: "BOT",
							content: `Transaction successful click the link below to check your transaction on base sepolia scan:\n\nhttps://sepolia.basescan.org/tx/${txhash}`,
							model: activeAgentModel.name,
						});
						setAgentStatus("Idle");
						return;
					} catch (error) { }
				}

				if (reply.toLowerCase() == "false") {
					push({
						role: "BOT",
						content: `Transaction request not within agent delegated scope please increase delegate for your metamux agent to be able to carry out this transaction`,
						model: activeAgentModel.name,
					});
				}

				//code to handle delegation request for the users metamux ai agent wallet
				if (
					res_json.type.toLowerCase() === "send" &&
					res_json.token.toLowerCase() === "eth"
				) {
					const expiry = Math.floor(Date.now() / 1000) + 3600 * 24;
					const delegationReq = erc7715NativeTokenSendSchema(
						readAgentWallet().address, // replace this with the users metamux agent eoa wallet
						res_json.amount,
						expiry.toString(),
					);

					push({
						role: "BOT",
						content: `Please click the link below to sign this 24 hour delegation request to your agent \n\n${createToken(JSON.stringify(delegationReq))}`,
						model: activeAgentModel.name,
					});
				}

				setAgentStatus("Idle");
				return;
			}
			// 4. Append the CURRENT user input (this is what `text` is for)
			cleanedOutMessages.push({ role: "user", content: text });

			try {
				const res = await client.chat.completions.create({
					model: activeAgentModel.id,
					messages: cleanedOutMessages,
				});

				const reply = res.choices[0]?.message?.content ?? "No response";

				push({
					content: reply,
					role: "BOT",
					model: activeAgentModel.name,
				});
			} catch (err) {
				push({
					content: `Error: ${err instanceof Error ? err.message : "Unknown error"}`,
					role: "ERROR",
				});
			} finally {
				setAgentStatus("Idle");
			}
		},
		[setAgentStatus, activeAgentModel, activeSessionManager, push],
	);
	useEffect(() => {
		try {
			setActiveModel(readFile("activeAIModel"));
		} catch { }
	}, []);

	useEffect(() => {
		getOrCreateAgentWallet();
	}, []);

	return (
		<ModelProviderContext.Provider
			value={{
				agentStatus,
				activeModel: activeAgentModel as Model,
				InteractWithAgent,
				setActiveAgentModel,
				activeSessionTitle,
				setActiveSessionTitle,
				push,
				titleSession,
				activeSessionManager,
				saveSession,
			}}
		>
			{children}
		</ModelProviderContext.Provider>
	);
};
