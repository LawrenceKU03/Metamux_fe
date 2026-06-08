import StatusBar from "./StatusBar";

const index = () => {
	return (
		<box width="100%" alignItems="center">
			<box width="100%" border={["left"]} borderColor={"#E67E22"}>
				<box backgroundColor={"#1A1A1A"} paddingY={1} paddingX={2}>
					<textarea
						placeholder={"What to do onchain today? 'swap 10 usdc to eth'"}
						paddingY={0.5}
					></textarea>
					<StatusBar />
				</box>
			</box>
		</box>
	);
};

export default index;
