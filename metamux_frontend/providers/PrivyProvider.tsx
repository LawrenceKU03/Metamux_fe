// @ts-ignore

import { PrivyProvider } from "@privy-io/react-auth";
import { ReactNode } from "react";
import { baseSepolia } from "viem/chains";

type PrivyProviderProps = {
	children: ReactNode;
};

const index: React.FC<PrivyProviderProps> = ({ children }) => {
	return (
		<PrivyProvider
			appId={import.meta.env.VITE_PRIVY_APP_ID}
			config={{
				appearance: {
					theme: "dark",
					accentColor: "#676FFF",
				},
				loginMethods: ["wallet"],
				embeddedWallets: {},
				defaultChain: baseSepolia,
				supportedChains: [baseSepolia],
			}}
		>
			{children}
		</PrivyProvider>
	);
};

export default index;
