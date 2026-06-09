import type { dialogContextValue } from "../../providers/DialogProvider";
import type { ToastContextValue } from "../../providers/ToastProvider";

export type CommandContext = {
	exit: () => void;
	dialog: dialogContextValue;
	toast: ToastContextValue;
};

export type Command = {
	title: string;
	value: string;
	description: string;
	actions: (ctx: CommandContext) => void;
};
