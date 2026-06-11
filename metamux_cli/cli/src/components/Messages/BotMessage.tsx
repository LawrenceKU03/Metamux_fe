type Props = {
	content: string;
	model: string;
};

const index = ({ content, model }: Props) => {
	return (
		<box width="100%" alignItems="center">
			<box paddingY={1} width="100%">
				<box paddingX={3} width="100%">
					<text>{content}</text>
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
