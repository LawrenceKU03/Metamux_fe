import { exec } from "child_process";
import { useState } from "react";
import { UserOperationSignatureError } from "viem/account-abstraction";

type Props = {
	content: string;
	model: string;
};

const openInBrowser = (token: string) => {
	//hardcoding to bypass '/' addition bug

	const localURL = `http://localhost:5173?delegationRequestPayload=${token}`;

	const platform = process.platform;
	let command = "";

	if (platform === "win32") {
		command = `start ${localURL}`;
	} else if (platform === "darwin") {
		command = `open ${localURL}`;
	} else {
		command = `xdg-open ${localURL}`;
	}

	exec(command);
};
const openInBlockchainExplorer = (txHash: string) => {
	//hardcoding to bypass '/' addition bug

	const localURL = txHash;

	const platform = process.platform;
	let command = "";

	if (platform === "win32") {
		command = `start ${localURL}`;
	} else if (platform === "darwin") {
		command = `open ${localURL}`;
	} else {
		command = `xdg-open ${localURL}`;
	}

	exec(command);
};

const index = ({ content, model }: Props) => {
	const texts = content
		.split(/\r?\n/) // Splits on both Linux/macOS (\n) and Windows (\r\n)
		.filter((line) => line.trim() !== "");
	const [isHovered, setIsHovered] = useState(false);

	return (
		<box width="100%" alignItems="center">
			<box paddingY={1} width="100%">
				<box paddingX={3} width="100%">
					<text>{texts[0]}</text>
					<text></text>
					{texts.length > 1 && texts[1]?.length > 300 && (
						<box onMouseDown={() => openInBrowser(texts[1] as string)}>
							<text
								fg={isHovered ? "#FFA34D" : "#89B4FA"}
							>{`http://localhost:5173?delegationRequestPayload=${texts[1]}`}</text>
						</box>
					)}
					{texts.length > 1 && texts[1]?.length > 300 && (
						<text>{`\nPlease paste in the encrypted delegation payload you would be asked to copy into your metamux session to activate this delegation request for metamux agent`}</text>
					)}
					{texts.length > 1 && texts[1]?.length < 300 && (
						<text
							fg="#E67E22"
							onMouseDown={() => openInBlockchainExplorer(texts[1] as string)}
						>
							{texts[1]}
						</text>
					)}
				</box>
			</box>
			<box paddingX={3} paddingBottom={1} width="100%">
				<box flexDirection="row" gap={2}>
					<text fg="#56D6C2">◉</text>
					<text>{model}</text>
				</box>
			</box>
		</box>
	);
};

export default index;
