import StatusBar from "./StatusBar";
import { TextareaRenderable, type KeyBinding } from "@opentui/core";
import type { Command } from "./CommandMenu/types";
import useCommandMenu from "./CommandMenu/useCommandMenu";
import {
	useKeyboardContext,
	type KeyboardContextProviderProps,
} from "../providers/KeyboardProvider";
import { useCallback, useEffect, useRef } from "react";
import { useRenderer } from "@opentui/react";
import CommandMenu from "./CommandMenu";

const TEXT_AREA_BINDING: KeyBinding[] = [
	{ name: "enter", action: "submit" },
	{ name: "n", ctrl: true, action: "newline" },
];

type InputBarProps = {
	onSubmit: (text: string) => void;
};

const index = ({ onSubmit }: InputBarProps) => {
	const textareaRef = useRef<TextareaRenderable>(null);
	const onSubmitRef = useRef<() => void>(() => {});
	const { isTopLayer, setResponder } =
		useKeyboardContext() as KeyboardContextProviderProps;
	const renderer = useRenderer();
	const disabled = false;

	const {
		showCommandMenu,
		commandQuery,
		selectedIndex,
		scrollRef,
		handleContentChange,
		resolveCommand,
		setSelectedIndex,
	} = useCommandMenu();

	const handleCommand = useCallback(
		(command: Command) => {
			const textarea = textareaRef.current;
			if (!textarea || !command) return;
			textarea.setText("");
			if (command.actions) {
				command.actions({
					exit: () => renderer.destroy(),
				});
			} else {
				textarea.insertText(command.value + " ");
			}
		},
		[renderer],
	);

	const handleTextareaContentChange = useCallback(() => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		handleContentChange(textarea.plainText);
	}, [handleContentChange]);

	const handleCommandExecute = useCallback((index: number) => {
		const command: Command = resolveCommand(index);
		handleCommand(command);
	}, []);

	const handleSubmit = useCallback(() => {
		if (disabled) return;

		const textarea = textareaRef.current;

		if (showCommandMenu) {
			const command = resolveCommand(selectedIndex);
			handleCommand(command);
			return;
		}

		if (!textarea) return;

		const text = textarea.plainText.trim();
		if (text.length === 0) return;

		onSubmit(text);
		textarea.setText("");
	}, [disabled, onSubmit, showCommandMenu, selectedIndex]);

	useEffect(() => {
		setResponder("base", () => {
			if (disabled) return false;

			const textarea = textareaRef.current;

			if (textarea && textarea.plainText.length > 0) {
				textarea.setText("");
				return true;
			}
			return false;
		});

		return () => setResponder("base", null);
	}, [disabled, setResponder]);

	return (
		<box width="100%" alignItems="center">
			{showCommandMenu && (
				<CommandMenu
					query={commandQuery}
					selectIndex={selectedIndex}
					scrollRef={scrollRef}
					onSelect={setSelectedIndex}
					onExecute={handleCommandExecute}
				/>
			)}

			<box width="100%" border={["left"]} borderColor={"#E67E22"}>
				<box backgroundColor={"#1A1A1A"} paddingY={1} paddingX={2}>
					<textarea
						ref={textareaRef}
						placeholder={"What to do onchain today? 'swap 10 usdc to eth'"}
						paddingY={0.5}
						onSubmit={() => handleSubmit()}
						onContentChange={handleTextareaContentChange}
						keyBindings={TEXT_AREA_BINDING}
					></textarea>
					<StatusBar />
				</box>
			</box>
		</box>
	);
};

export default index;
