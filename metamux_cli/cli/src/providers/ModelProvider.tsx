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
	const [activeAgentModel, setActiveModel] = useState<Model | null>({
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

	const InteractWithAgent = useCallback(
		(text: string, prompt?: string) => {
			setAgentStatus("Parsing");
			push({
				content: "Hello user!",
				role: "BOT",
				model: activeAgentModel?.name,
			});
			setAgentStatus("Idle");
		},
		[setAgentStatus, activeAgentModel, push],
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
