import { useState, useCallback } from "react";
// fflate provides optimized string-to-buffer utilities and zlib methods
import { strToU8, strFromU8, zlibSync, unzlibSync } from "fflate";

const useCompression = () => {
	const [compressedData, setCompressedData] = useState<string>("");
	const [decompressedData, setDecompressedData] = useState<any>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	// 1. COMPRESS (Object/String -> Tiny Base64 String)
	const pack = useCallback((data: any) => {
		setIsLoading(true);
		setError(null);
		try {
			// Ensure data is a text string
			const stringData = typeof data === "string" ? data : JSON.stringify(data);

			// fflate's ultra-fast string to Uint8Array encoder
			const textBytes = strToU8(stringData);

			// zlibSync compresses the data. level 9 is maximum compression.
			// (Default is 6. 9 takes slightly longer but yields the smallest string)
			const compressedBytes = zlibSync(textBytes, { level: 9 });

			// Convert Uint8Array to Base64
			const base64Result = btoa(String.fromCharCode(...compressedBytes));

			setCompressedData(base64Result);
			setIsLoading(false);
			return base64Result;
		} catch (err) {
			console.error("Packing failed:", err);
			setError("Failed to compress data.");
			setIsLoading(false);
			return null;
		}
	}, []);

	// 2. DECOMPRESS (Base64 String -> Original Object/String)
	const unpack = useCallback((base64String: string) => {
		if (!base64String) return null;
		setIsLoading(true);
		setError(null);
		try {
			// Convert Base64 back to Uint8Array safely
			const compressedBytes = Uint8Array.from(atob(base64String), (c) =>
				c.charCodeAt(0),
			);

			// Decompress back to original bytes
			const decompressedBytes = unzlibSync(compressedBytes);

			// fflate's ultra-fast Uint8Array to string decoder
			const jsonString = strFromU8(decompressedBytes);

			// Attempt to parse back to JSON object
			let finalResult;
			try {
				finalResult = JSON.parse(jsonString);
			} catch {
				finalResult = jsonString;
			}

			setDecompressedData(finalResult);
			setIsLoading(false);
			return finalResult;
		} catch (err) {
			console.error("Unpacking failed:", err);
			setError("Failed to decompress data. Integrity check failed.");
			setIsLoading(false);
			return null;
		}
	}, []);

	const reset = useCallback(() => {
		setCompressedData("");
		setDecompressedData(null);
		setError(null);
	}, []);

	return {
		pack,
		unpack,
		compressedData,
		decompressedData,
		isLoading,
		error,
		reset,
	};
};

export default useCompression;
