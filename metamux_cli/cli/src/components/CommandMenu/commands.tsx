import { type Command, type CommandContext } from "./types";
import ModelDialogList from "../ModelDialogList";

export const commands: Command[] = [
	{
		title: "x402",
		value: "/x402",
		description: "Make x402 payment",
		actions: (ctx: CommandContext) => { },
	},
	{
		title: "chains",
		value: "/chains",
		description: "Switch between supported chains",
		actions: (ctx: CommandContext) => {
			ctx.toast.show({ message: "Coming soon!!" });
		},
	},

	{
		title: "delegate",
		value: "/delegate",
		description: "Hot-reload active EIP-7702 via encrypted payload.",
		actions: (ctx: CommandContext) => { },
	},
	{
		title: "revoke",
		value: "/revoke",
		description:
			"Instantly terminate your agent's execution bounds and revoke delegated authority",
		actions: (ctx: CommandContext) => {
			ctx.toast.show({
				message: "Revoke functionality comming soon",
				variant: "info",
			});
		},
	},
	{
		title: "models",
		value: "/models",
		description: "Pick which model to use for parsing",
		actions: (ctx: CommandContext) => {
			ctx.dialog.open({
				title: "Venice AI Models",
				children: <ModelDialogList />,
			});
		},
	},
	{
		title: "stash",
		value: "/stash",
		description: "Stash delegations you use frequently",
		actions: (ctx: CommandContext) => { },
	},

	{
		title: "exit",
		value: "/exit",
		description:
			"Safely close the MetaMux workspace background daemon and end your session.",
		actions: (ctx: CommandContext) => {
			ctx.exit();
		},
	},
];
