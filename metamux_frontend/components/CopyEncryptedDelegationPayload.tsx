// @ts-ignore
import useUpgradeEOA from "../hooks/useUpgradeEOA";
import GlassOverlay from "./GlassOverlay";
import useEncryptionHandler from "../hooks/useEncryptionHandler";
import { FaRegCopy } from "react-icons/fa";
import useCopyToClipboard from "../hooks/useCopyandPaste";
import { useState, useEffect } from "react";
const index = () => {
	const { createToken } = useEncryptionHandler();
	const permissionContext = useUpgradeEOA((state) => state.permissionContext);

	const [signedDelegation, setSignedDelegation] = useState<string | null>(null);

	useEffect(() => {
		if (!permissionContext) return;

		const stringifiedContext = JSON.stringify(permissionContext, (_, value) =>
			typeof value === "bigint" ? value.toString() : value,
		);

		const token = createToken(stringifiedContext);
		console.log(token);
		setSignedDelegation(token);
	}, [permissionContext]);

	const { copyToClipboard } = useCopyToClipboard();

	const truncateString = (
		str: string,
		maxLength: number,
		suffix: string = "...",
	) => {
		// If the string is already short enough, return it as-is
		if (str.length <= maxLength) {
			return str;
		}

		// Ensure we don't end up with a negative index
		const cutLength = Math.max(0, maxLength + 30 - suffix.length);

		return str.slice(0, cutLength) + suffix;
	};
	return (
		<GlassOverlay>
			<div className="w-full h-full flex justify-center items-center">
				<div className="w-[40%] h-max p-4 rounded-[26px] bg-white ">
					<p className="wrap-break-word bg-gray-300 p-4 rounded-[24px] wmax h-max overflow-hidden font-['Poppins']">
						{signedDelegation && truncateString(signedDelegation, 350, "***")}
					</p>
					<button
						onClick={() => copyToClipboard(signedDelegation as string)}
						className="bg-orange-500 p-4 rounded-[24px] font-bold text-white text-center flex justify-center items-center mt-6 mx-auto font-['Poppins']"
					>
						Copy Delegation Payload <FaRegCopy size={24} className="ml-2" />
					</button>
				</div>
			</div>
		</GlassOverlay>
	);
};

export default index;
