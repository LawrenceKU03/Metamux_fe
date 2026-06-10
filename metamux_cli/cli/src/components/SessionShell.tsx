import { TextAttributes } from "@opentui/core";
import type { ReactNode } from "react";
import InputBar from "./InputBar";
import Spinner from "./Spinner";

type Props = {
	children?: ReactNode;
	onSubmit: (text: string) => void;
	loading: boolean;
};

const index = ({ children, onSubmit, loading = false }: Props) => {
	return (
		<box
			flexDirection="column"
			flexGrow={1}
			width="100%"
			paddingX={2}
			paddingY={1}
			backgroundColor={"#0d0d12"}
		>
			<scrollbox stickyScroll stickStart="bottom">
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
					{loading ? <Spinner /> : null}
				</box>
				<box
					flexDirection="row"
					alignItems="center"
					gap={1}
					flexShrink={0}
					marginLeft="auto"
				>
					<text>Built for the Metamask Dev Cook-off</text>
				</box>
			</box>
		</box>
	);
};

export default index;
