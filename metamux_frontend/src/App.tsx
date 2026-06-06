import Navbar from "../components/Navbar";
import GlassOverlay from "../components/GlassOverlay";
import SideBar from "../components/Sidebar";
import useNavbar from "../hooks/useNavbar";

const index = () => {
	const isNavOpen = useNavbar((state) => state.isNavOpen);

	return (
		<div className="w-full h-full">
			{isNavOpen?.sectionOpen == "audience" && (
				<GlassOverlay>
					<SideBar
						title={"Built For"}
						listItems={[
							{
								title: "Smart Contract Devs",
								desc: "Test and interact with deployed contracts without leaving your terminal",
							},
							{
								title: "DeFi Builders",
								desc: "Execute protocol interactions and manage positions via natural language",
							},
							{
								title: "Hackathon Builders",
								desc: "Ship faster without building frontends just to test your contracts",
							},
							{
								title: "Web3 Power Users",
								desc: "Manage assets, make payments and switch networks from one workspace",
							},
							{
								title: "Protocol Teams",
								desc: "Stress test contracts with multiple AI agents before mainnet deployment",
							},
						]}
					/>
				</GlassOverlay>
			)}
			{isNavOpen?.sectionOpen == "capabilites" && (
				<GlassOverlay>
					<SideBar
						title={"Capabilities"}
						listItems={[
							{
								title: "Gasless Wallet Execution",
								desc: "Send USDC or ETH to any address or ENS",
							},
							{
								title: "Natural Language Smart Contract Invocation",
								desc: "Query any smart contract state in plain English",
							},
							{
								title: "x402 Terminal Payments",
								desc: "Pay for any x402-gated API endpoint from terminal",
							},
							{
								title: "Realtime Delegation Switch",
								desc: "Expand delegation scope to include new contracts",
							},
						]}
					/>
				</GlassOverlay>
			)}
			{isNavOpen?.sectionOpen == "agents" && (
				<GlassOverlay>
					<SideBar
						title={"Agents"}
						listItems={[
							{
								title: "Kimi 2.6",
							},
							{
								title: "GPT 5.5",
							},
							{
								title: "Claude Sonnet 4.6",
							},
							{
								title: "Grok 4.20",
							},
							{
								title: "Venice Uncensored 1.2",
							},
							{
								title: "Venice Role Play Uncensored",
							},
							{ title: "GLM 4.7 Flash" },
						]}
					/>
				</GlassOverlay>
			)}
			<Navbar />
			<div className="w-full flex justify-center items-center flex-col mt-[5%]">
				<p className="text-white text-6xl flex items-center font-['Instrument_Serif']">
					<h1 className="font-['Poppins'] font-semibold mr-4">Meet</h1>
					<i>Metamux</i>
				</p>{" "}
				<p className="flex justify-center items-center text-2xl text-white my-6 uppercase font-['Space_Grotesk']">
					<b>Your Terminal</b> <b className="mx-8">Your Rules</b>{" "}
					<b>All OnChain</b>
				</p>
				<p className="text-white font-['Poppins'] mx-[20%] text-center">
					MetaMux is a terminal-native Web3 workspace powered by MetaMask Smart
					Accounts and 1Shot API, interact with any smart contract, send funds,
					and make x402 payments gaslessly from your command line. Venice AI
					parses your plain English prompts through private, uncensored models
					so every execution stays fast, anonymous, and unrestricted. No browser
					switching. No Etherscan. No gas. Just type and execute.
				</p>
				<div className="mt-8">
					<button className="px-4 py-2 border-l-2 border-l-white text-white border-r-2 border-r-white  uppercase shadow-[0_0_8px_rgba(0,0,0,0.6)] cursor-pointer">
						Try Metamux
					</button>
					<button className="px-4 py-2 bg-orange-500 text-2xl text-white font-bold font-['Instrument_Serif'] ml-8 uppercase shadow-[0_0_8px_rgba(0,0,0,0.6)] cursor-pointer">
						View @HackQuest
					</button>
				</div>
			</div>
		</div>
	);
};

export default index;
