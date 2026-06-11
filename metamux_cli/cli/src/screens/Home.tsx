import { useCallback } from "react";
import { useNavigate } from "react-router";
import Header from "../components/Header";
import InputBar from "../components/InputBar";
import {
	useModelContext,
	type ModelContextProps,
} from "../providers/ModelProvider";

const index = () => {
	const navig = useNavigate();
	const { InteractWithAgent } = useModelContext() as ModelContextProps;

	const handleSubmit = useCallback(
		(text: string) => {
			InteractWithAgent(text);
			navig("/session/new", { state: { message: text } });
		},
		[navig],
	);

	return (
		<box
			alignItems="center"
			width="100%"
			height="100%"
			justifyContent="center"
			flexGrow={1}
			backgroundColor={"#0D0D12"}
			gap={3}
		>
			<Header />
			<box width="100%" alignItems="center" justifyContent="center">
				<box maxWidth={78} width="100%">
					<InputBar onSubmit={handleSubmit} />
				</box>
			</box>
		</box>
	);
};

export default index;
