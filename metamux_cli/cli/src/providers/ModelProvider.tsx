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

const BASE_URL_VENICE = "https://api.venice.ai/api/v1";
const API_KEY_VENICE =
	"VENICE_INFERENCE_KEY_-Yfvoqe8GmiLEklEvzh6UofHgEWUe2jQK54u2Ye5v3";

import OpenAI from "openai";
import type { ChatCompletionParseParams } from "openai/resources/chat/completions.mjs";

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
		} catch {}
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

	type VeniceAgentMessage = {
		role: string;
		content: string;
	};

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
		} catch {}
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
