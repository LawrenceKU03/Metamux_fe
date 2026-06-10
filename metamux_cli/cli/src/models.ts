export type Model = {
	id: string;
	name: string;
	contextWindow: number;
};

export const MODELS: Model[] = [
	{
		id: "claude-haiku-4-5-20251001",
		name: "Claude Haiku 4.5",
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
