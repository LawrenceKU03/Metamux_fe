import { env } from "bun";

export type Model = {
	id: string;
	name: string;
	contextWindow: number;
};

export const MODELS: Model[] = [
	{
		id: "claude-opus-4-7",
		name: "Claude Opus 4.7",
		contextWindow: 200000,
	},
	{
		id: "gpt-4o-mini-2024-07-18",
		name: "GPT-4o Mini",
		contextWindow: 128000,
	},
	{
		id: "qwen3-5-9b",
		name: "Qwen 3.5 9B",
		contextWindow: 262000,
	},
	{
		id: "mistral-small-2603",
		name: "Mistral Small 4",
		contextWindow: 256000,
	},
	{
		id: "mercury-2",
		name: "Mercury 2",
		contextWindow: 128000,
	},
	{
		id: "e2ee-venice-uncensored",
		name: "Venice Uncensored 1.1",
		contextWindow: 32000,
	},
];

export const MODEL_ERC7715_PARSE_FUNCTION = (
	erc7715TargetScopeSchema: string,
) => {
	return `
You are the MetaMux AI Agent Execution Parser.
The user wants to grant your session key specific, limited wallet permissions.
You must ONLY reply with a JSON object matching this schema. Do not include markdown wraps or explanations.

Schema:${erc7715TargetScopeSchema}
`;
};
