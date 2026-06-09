import {
	useRef,
	useContext,
	useCallback,
	useState,
	createContext,
} from "react";
import type { ReactNode } from "react";
import { TextAttributes, RGBA } from "@opentui/core";
import { useKeyboard, useTerminalDimensions } from "@opentui/react";
import type { DialogConfig } from "./types/dialog.types.ts";
import {
	useKeyboardContext,
	type KeyboardContextProviderProps,
} from "./KeyboardProvider";

export type dialogContextValue = {
	open: (config: DialogConfig) => void;
	close: () => void;
};

const dialogContext = createContext<dialogContextValue | null>(null);

export const useDialog = (): dialogContextValue | null => {
	const value = useContext(dialogContext);

	if (!value) {
		return null;
	}

	return value;
};

type dialogProviderProps = {
	children: ReactNode;
};

type dialogProps = {
	currentDialog: DialogConfig | null;
	close: () => void;
};

const Dialog = ({ currentDialog, close }: dialogProps) => {
	const { isTopLayer } = useKeyboardContext() as KeyboardContextProviderProps;
	const dimensions = useTerminalDimensions();

	useKeyboard((key) => {
		if (!currentDialog || !isTopLayer("dialog")) return;

		if (key.name == "c" || key.name == "escape") {
			close();
			return;
		}
	});

	if (!currentDialog) {
		return null;
	}

	const { title, children, type } = currentDialog as DialogConfig;

	return (
		<box
			position="absolute"
			left={0}
			top={0}
			width={dimensions.width}
			height={dimensions.height}
			justifyContent="center"
			alignItems="center"
			backgroundColor={RGBA.fromInts(0, 0, 0, 100)}
			zIndex={100}
			onMouseDown={() => close()}
		>
			<box
				width={Math.min(60, dimensions.width - 4)}
				height="auto"
				backgroundColor={"#0a0a0a"}
				paddingX={4}
				paddingY={1}
				flexDirection="column"
				gap={1}
				onMouseDown={(e) => e.stopPropagation()}
			>
				<box
					paddingBottom={1}
					flexDirection="row"
					alignItems="center"
					justifyContent="space-between"
				>
					<text attributes={TextAttributes.BOLD}>{title}</text>
					<text attributes={TextAttributes.BOLD} onMouseDown={() => close()}>
						esc
					</text>
				</box>
				{type === "text" ? (
					<box flexGrow={1}>
						<text>{children}</text>
					</box>
				) : (
					<box flexGrow={1}>{children}</box>
				)}
			</box>
		</box>
	);
};

type DialogProviderProps = {
	children: ReactNode;
};

export const DialogProvider = ({ children }: DialogProviderProps) => {
	const [currentDialog, setCurrentDialog] = useState<DialogConfig | null>(null); // Fixed: Casing
	const { push, pop } = useKeyboardContext() as KeyboardContextProviderProps;

	const close = useCallback(() => {
		setCurrentDialog(null);
		pop("dialog");
	}, [pop]);

	const open = useCallback(
		(config: DialogConfig) => {
			setCurrentDialog(config);
			push("dialog", () => {
				close();
				return true;
			});
		},
		[push, close],
	);

	return (
		<dialogContext.Provider value={{ close, open }}>
			{children}
			<Dialog currentDialog={currentDialog} close={close} />
		</dialogContext.Provider>
	);
};
