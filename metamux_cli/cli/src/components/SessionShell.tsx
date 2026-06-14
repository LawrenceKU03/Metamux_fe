import { useEffect, useRef, type ReactNode } from "react";
import InputBar from "./InputBar";
import Spinner from "./Spinner";
import {
	useModelContext,
	type ModelContextProps,
} from "../providers/ModelProvider";
import { useTerminalDimensions } from "@opentui/react";
import useAgentWallet, { type AgentWalletDetails } from "../hooks/useAgentWallet";

type Props = {
	children?: ReactNode;
	onSubmit: (text: string) => void;
};

const index = ({ children, onSubmit }: Props) => {
	const { agentStatus, activeSessionManager } =
		useModelContext() as ModelContextProps;
	const scrollRef = useRef(null);
	const { height } = useTerminalDimensions();
	const { readAgentWallet } = useAgentWallet();
	//const [agentData, setAgentData] = useState<AgentWalletDetails | null>(null);
	const agentData = readAgentWallet();

	useEffect(() => {
		scrollRef.current.scrollTo(height * 3_000);
	}, [activeSessionManager.activeSession?.messages.length]);

	return (
		<box
			flexDirection="column"
			flexGrow={1}
			width="100%"
			paddingX={2}
			paddingY={1}
			backgroundColor={"#0d0d12"}
		>
			<scrollbox stickyScroll stickStart="bottom" flexGrow={1} ref={scrollRef}>
				<box>{children}</box>
			</scrollbox>
			<box flexShrink={0}>
				<InputBar onSubmit={onSubmit} />
			</box>
			<box
				flexShrink={0}
				flexDirection="row"
				justifyContent="space-between"
				width="100%"
				height={1}
				gap={2}
				paddingLeft={1}
				paddingY={1}
			>
				<box flexDirection="row" alignItems="center" gap={2}>
					{agentStatus != "Idle" ? <Spinner /> : <box flexDirection="row" alignItems="center"><text fg="#FFA34D">Chain</text><text fg="gray"> >> </text><text>[Base Sepolia]</text></box>}

				</box>
				<box flexDirection="row"
					alignItems="center"
					gap={1}
					flexShrink={0}
					marginLeft="auto"
				>
					<text>{agentData && agentData.address}</text>
					<text fg="gray"> {`<<`} </text>
					<text fg="#FFA34D">Agent Delegation Wallet Address</text>
				</box>
			</box>
		</box>
	);
};

export default index;
