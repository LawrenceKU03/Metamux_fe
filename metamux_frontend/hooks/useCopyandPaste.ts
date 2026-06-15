// @ts-ignore

import { useState, useCallback, useRef } from "react";

interface UseCopyToClipboardOptions {
	resetDelay?: number; // ms before "copied" resets, default 2000
}

export function useCopyToClipboard(options: UseCopyToClipboardOptions = {}) {
	const { resetDelay = 2000 } = options;
	const [copied, setCopied] = useState(false);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const copyToClipboard = useCallback(
		async (text: string): Promise<boolean> => {
			let success = false;
			console.log(text);

			// Modern browsers (Navigator Clipboard API)
			if (navigator.clipboard && window.isSecureContext) {
				try {
					await navigator.clipboard.writeText(text);
					success = true;
				} catch (err) {
					console.error("Clipboard API failed, trying fallback...", err);
				}
			}

			// Fallback for older browsers or non-HTTPS environments
			if (!success) {
				const textArea = document.createElement("textarea");
				textArea.value = text;

				// Prevent scrolling to bottom of page in some browsers
				textArea.style.position = "fixed";
				textArea.style.top = "0";
				textArea.style.left = "0";
				textArea.style.opacity = "0";

				document.body.appendChild(textArea);
				textArea.focus();
				textArea.select();

				try {
					success = document.execCommand("copy");
				} catch (err) {
					console.error("Fallback copy failed:", err);
					success = false;
				} finally {
					document.body.removeChild(textArea);
				}
			}

			setCopied(success);

			if (timeoutRef.current) clearTimeout(timeoutRef.current);
			if (success) {
				timeoutRef.current = setTimeout(() => setCopied(false), resetDelay);
			}

			return success;
		},
		[resetDelay],
	);

	return { copied, copyToClipboard };
}

export default useCopyToClipboard;
