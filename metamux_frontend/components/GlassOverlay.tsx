import React from "react";
import { twMerge } from "tailwind-merge";

interface GlassOverlayProps {
	children: React.ReactNode;
	className?: string;
}

const index: React.FC<GlassOverlayProps> = ({ children, className }) => {
	return (
		<div
			className={twMerge(
				"fixed inset-0 z-[70] h-full w-full bg-black/35 backdrop-blur-md",
				className,
			)}
		>
			{children}
		</div>
	);
};

export default index;
