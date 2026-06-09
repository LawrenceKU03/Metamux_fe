import { type Command, type CommandContext } from "./types";

export const commands: Command[] = [
	{
		title: "x402",
		value: "/x402",
		description: "Make x402 payment",
		actions: (ctx: CommandContext) => {},
	},
	{
		title: "delegate",
		value: "/delegate",
		description:
			"Hot-reload active EIP-7702 capabilities by pasting an encrypted session payload.",
		actions: (ctx: CommandContext) => {},
	},
	{
		title: "revoke",
		value: "/revoke",
		description:
			"Instantly terminate your agent's execution bounds and revoke delegated authority",
		actions: (ctx: CommandContext) => {},
	},
	{
		title: "models",
		value: "/models",
		description: "Pick which model to use for parsing",
		actions: (ctx: CommandContext) => {},
	},
	{
		title: "theme",
		value: "/theme",
		description:
			"Customize the terminal TUI appearance, borders, and color configuration.",
		actions: (ctx: CommandContext) => {},
	},
	{
		title: "exit",
		value: "/exit",
		description:
			"Safely close the MetaMux workspace background daemon and end your session.",
		actions: (ctx: CommandContext) => {},
	},
];
