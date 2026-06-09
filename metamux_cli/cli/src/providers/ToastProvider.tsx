import {
	useRef,
	useContext,
	useCallback,
	useState,
	createContext,
} from "react";
import type { ReactNode } from "react";
import { useTerminalDimensions } from "@opentui/react";
import type { ToastVariant, ToastOptions } from "./types/toast.types.ts";
import { DEFAULT_DURATION } from "./types/toast.types.ts";

export type ToastContextValue = {
	show: (options: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = (): ToastContextValue => {
	const value = useContext(ToastContext);
	if (!value) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return value;
};

type ToastProps = {
	currentToast: ToastOptions | null;
};

const Toast = ({ currentToast }: ToastProps) => {
	const { width } = useTerminalDimensions();

	if (!currentToast) {
		return null;
	}

	const ToastVariantColors: Record<ToastVariant, string> = {
		success: "#2ECC71",
		error: "#E74C3C",
		info: "#3498DB",
	};
	const borderColor = currentToast.variant
		? ToastVariantColors[currentToast.variant]
		: ToastVariantColors.info;

	return (
		<box
			position="absolute"
			justifyContent="center"
			alignItems="flex-start"
			top={2}
			right={2}
			width={Math.max(1, Math.min(60, width - 6))}
			padding={2}
			paddingTop={1}
			paddingBottom={1}
			backgroundColor={"#0A0A0A"}
			borderColor={borderColor}
			border={["left", "right"]}
		>
			<box flexDirection="column" gap={1} width="100%">
				<text fg="#e1e1e1" wrapMode="word" width="100%">
					{currentToast.message}
				</text>
			</box>
		</box>
	);
};

type ToastProviderProps = {
	children: ReactNode;
};

export const ToastProvider = ({ children }: ToastProviderProps) => {
	const [currentToast, setCurrentToast] = useState<ToastOptions | null>(null);
	const timeoutHandleRef = useRef<NodeJS.Timeout | null>(null);

	const clearCurrentTimeout = useCallback(() => {
		if (timeoutHandleRef.current) {
			clearTimeout(timeoutHandleRef.current);
			timeoutHandleRef.current = null;
		}
	}, []);

	const show = useCallback(
		(options: ToastOptions) => {
			const duration = options.duration ?? DEFAULT_DURATION;
			clearCurrentTimeout();

			setCurrentToast({
				variant: options.variant ?? "info",
				...options,
				duration,
			});

			const handler = setTimeout(() => {
				setCurrentToast(null);
			}, duration);
			handler.unref();
			timeoutHandleRef.current = handler;
		},
		[clearCurrentTimeout],
	);

	const value: ToastContextValue = {
		show,
	};

	return (
		<ToastContext.Provider value={value}>
			{children}
			<Toast currentToast={currentToast} />
		</ToastContext.Provider>
	);
};
