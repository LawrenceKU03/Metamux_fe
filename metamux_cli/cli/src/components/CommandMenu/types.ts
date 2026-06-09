export type CommandContext = { exit: () => void };
};

export type Command = {
	title: string;
	value: string;
	description: string;
	actions: (ctx: CommandContext) => void;
};
