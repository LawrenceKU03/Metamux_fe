import { PrivyProvider } from "@privy-io/react-auth";
import { ReactNode } from "react";
import { sepolia } from "viem/chains";

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
				embeddedWallets: {
					createOnLogin: "users-without-wallets", // auto-create for Web2 users
				},
				defaultChain: sepolia,
				supportedChains: [sepolia],
			}}
		>
			{children}
		</PrivyProvider>
	);
};

export default index;
