import {
	ScrollBoxRenderable,
	TextAttributes,
	type ScrollBarRenderable,
} from "@opentui/core";
import type { RefObject } from "react";
import { useState, useMemo, useRef } from "react";
import { getFilteredCommands } from "./filterCommand";
import { useKeyboard } from "@opentui/react";
import type { Command } from "./types";
import { commands } from "./commands";
import {
	useKeyboardContext,
	type KeyboardContextProviderProps,
} from "../../providers/KeyboardProvider";

type useCommandMenuReturn = {
	showCommandMenu: boolean;
	commandQuery: string;
	selectedIndex: number;
	scrollRef: RefObject<ScrollBoxRenderable | null>;
	handleContentChange: (text: string) => void;
	resolveCommand: (index: number) => Command;
	setSelectedIndex: (index: number) => void;
};

const useCommandMenu = (): useCommandMenuReturn => {
	const [textValue, setTextValue] = useState("");
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [showCommandMenu, setShowCommandMenu] = useState(false);
	const scrollRef = useRef<ScrollBoxRenderable>(null);

	const { push, pop, isTopLayer } =
		useKeyboardContext() as KeyboardContextProviderProps;

	const commandQuery =
		showCommandMenu && textValue.startsWith("/") ? textValue.slice(1) : "";

	const filterCommand = useMemo(
		() => getFilteredCommands(commandQuery),
		[commandQuery],
	);

	const handleContentChange = (text: string) => {
		setTextValue(text);
		setSelectedIndex(0);

		const scrollBox = scrollRef.current;
		if (scrollBox) {
			scrollBox.scrollTo(0);
		}

		const prefix = text.startsWith("/") ? text.slice(1) : null;
		if (prefix !== null && !prefix.includes(" ")) {
			setShowCommandMenu(true);
			push("command_menu", () => {
				setShowCommandMenu(false);
				pop("command");
				return true;
			});
		} else {
			setShowCommandMenu(false);
			pop("command_menu");
		}
	};

	const resolveCommand = (index: number): Command => {
		const command: Command = filterCommand[index] as Command;
		if (command) {
			setShowCommandMenu(false);
		}
		return command;
	};

	useKeyboard((key) => {
		if (!showCommandMenu || !isTopLayer("command_menu")) return;

		if (key.name === "c") {
			key.preventDefault();
			setShowCommandMenu(false);
			pop("command_menu");
		} else if (key.name === "up") {
			key.preventDefault();
			setSelectedIndex((i: number) => {
				const newIndex = Math.max(0, i - 1);
				const sb = scrollRef.current;
				if (sb && newIndex < sb.scrollTop) {
					sb.scrollTo(newIndex);
				}
				return newIndex;
			});
		} else if (key.name === "down") {
			key.preventDefault();
			if (filterCommand.length === 0) return 0;
			setSelectedIndex((i: number) => {
				const newIndex = Math.min(filterCommand.length - 1, i + 1);
				const sb = scrollRef.current;

				const viewportHeight = sb?.viewport?.height;
				const visibleEnd = sb?.scrollTop + viewportHeight - 1;
				if (newIndex > visibleEnd) {
					sb.scrollTo(newIndex - viewportHeight + 1);
				}

				return newIndex;
			});
		}
	});

	return {
		showCommandMenu,
		commandQuery,
		selectedIndex,
		scrollRef,
		handleContentChange,
		resolveCommand,
		setSelectedIndex,
	};
};

export default useCommandMenu;
