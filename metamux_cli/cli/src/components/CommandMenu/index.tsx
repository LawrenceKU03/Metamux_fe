import { ScrollBoxRenderable, TextAttributes } from "@opentui/core";
import { commands } from "./commands";
import { getFilteredCommands } from "./filterCommand";
import type { Command } from "./types";
import type { RefObject } from "react";
const MAX_VISIBLE_ITEMS = 5;
const MAX_COL_WIDTH =
	Math.max(...commands.map((command) => command.title.length)) + 4;

type CommandMenuProps = {
	query: string;
	selectIndex: number;
	scrollRef: RefObject<ScrollBoxRenderable | null>;
	onSelect: (index: number) => void;
	onExecute: (index: number) => void;
};

const index = ({
	query,
	selectIndex,
	scrollRef,
	onSelect,
	onExecute,
}: CommandMenuProps) => {
	const filtered = getFilteredCommands(query);
	const visibleHeight = Math.min(filtered.length, MAX_VISIBLE_ITEMS);

	if (filtered.length == 0) {
		return (
			<box paddingX={2}>
				<text attributes={TextAttributes.DIM} fg="gray">
					No Matching Commands
				</text>
			</box>
		);
	}

	return (
		<scrollbox ref={scrollRef} height={visibleHeight}>
			{filtered.map((cmd: Command, i: number) => {
				const isSelected = i === selectIndex;
				return (
					<box
						key={cmd.value}
						flexDirection="row"
						paddingX={2}
						height={1}
						overflow="hidden"
						backgroundColor={isSelected ? "#FFA34D" : "#000"}
						onMouseMove={() => onSelect(i)}
						onMouseDown={() => onExecute(i)}
					>
						<box width={MAX_COL_WIDTH} flexShrink={0}>
							<text selectable={false} fg={isSelected ? "black" : "white"}>
								/{cmd.title}
							</text>
						</box>
						<box
							width={MAX_COL_WIDTH}
							flexGrow={1}
							flexShrink={1}
							overflow="hidden"
						>
							<text selectable={false} fg={isSelected ? "black" : "gray"}>
								{cmd.description}
							</text>
						</box>
					</box>
				);
			})}
		</scrollbox>
	);
};

export default index;
