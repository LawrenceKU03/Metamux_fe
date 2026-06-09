import { type Command } from "./types";
import { commands } from "./commands";

export const getFilteredCommands = (query: string): Command[] => {
	if (query.length == 0) {
		return commands;
	}

	return commands.filter((cmd: Command) =>
		cmd.title.toLowerCase().startsWith(query.toLowerCase()),
	);
};
