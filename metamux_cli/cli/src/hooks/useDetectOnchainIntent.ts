import { useState, useCallback } from "react";
import OpenAI from "openai";
import type { Model } from "../models";

const BASE_URL_VENICE = "https://api.venice.ai/api/v1";
const API_KEY_VENICE =
	"VENICE_INFERENCE_KEY_-Yfvoqe8GmiLEklEvzh6UofHgEWUe2jQK54u2Ye5v3";

const client = new OpenAI({
	apiKey: API_KEY_VENICE,
	baseURL: BASE_URL_VENICE,
	dangerouslyAllowBrowser: true,
});

const useDetectOnchainIntent = async (userInput: string, model: Model) => {
	try {
		const response = await client.chat.completions.create({
			// Replace with your preferred Venice model (e.g., "llama-3.1-70b" or "llama-3.3-70b")
			model: model.id,
			messages: [
				{
					role: "system",
					content:
						"You are an AI assistant that extracts on-chain crypto intents from user text. Parse the input and return a structured JSON object.",
				},
				{
					role: "user",
					content: userInput,
				},
			],
			// Enforce the strict JSON schema you requested
			response_format: {
				type: "json_schema",
				json_schema: {
					name: "onchain_intent",
					strict: true,
					schema: {
						type: "object",
						properties: {
							type: {
								type: "string",
								enum: ["swap", "send", "bal_check", "wallet_address_check"],
								description: "The type of on-chain action being requested.",
							},
							amount: {
								type: ["string", "null"],
								description:
									"The numeric quantity only, as a plain decimal string with NO unit, symbol, or token name attached. " +
									"Example: 'send 0.005 ETH to bob' -> amount is '0.005', NOT '0.005 ETH'. " +
									"Example: 'swap 10 usdc to eth' -> amount is '10', NOT '10 USDC'. " +
									"The token/currency name goes in its own field — never append it here. " +
									"Return null if no amount is mentioned.",
							},
							targetAddress: {
								type: ["string", "null"],
								description:
									"The destination or target wallet/token address. Return null if not provided.",
							},
							token: {
								type: ["string"],
								description: "The token the user would want to interact with.",
							},
							toToken: {
								type: ["string", "null"],
								description: "The token the user would want to swap to.",
							},
						},
						required: ["type", "amount", "targetAddress", "token", "toToken"],
						additionalProperties: false,
					},
				},
			},
		});

		// Parse and return the JSON payload
		const rawContent = response?.choices[0].message.content;
		return JSON.parse(rawContent as string);
	} catch (err) {
		console.error("Failed to detect intent:", err);
		return null;
	}
};

export default useDetectOnchainIntent;
