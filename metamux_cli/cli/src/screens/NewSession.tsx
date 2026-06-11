import { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import SessionShell from "../components/SessionShell";
import { UserMessage, BotMessage, ErrorMessage } from "../components/Messages";
import { useModelContext } from "../providers/ModelProvider";

const index = () => {
	const navig = useNavigate();
	const location = useLocation();
	const state = location.state;

	const { activeSessionManager, push, InteractWithAgent } = useModelContext();
	const { agentStatus } = useModelContext();

	const handleSubmit = useCallback(
		(text: string) => {
			navig("/session/:id", { state: { message: text } });
		},
		[navig],
	);

	useEffect(() => {
		push({ content: state.message, role: "USER" });
		InteractWithAgent(state.message);
	}, []);

	return (
		<SessionShell
			onSubmit={async (text: string) => {
				if (agentStatus != "Idle") {
					return;
				}
				push({ content: text, role: "USER" });
				InteractWithAgent(text);
			}}
		>
			{activeSessionManager?.activeSession.messages.map((message) => {
				if (message.role === "USER") {
					return <UserMessage message={message.content} />;
				}

				if (message.role === "BOT") {
					return <BotMessage content={message.content} model={message.model} />;
				}

				if (message.role === "ERROR") {
					return <ErrorMessage message={message.content} />;
				}
			})}
		</SessionShell>
	);
};

export default index;
