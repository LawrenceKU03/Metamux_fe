import DialogSearchList from "./DialogSearchList";
import { MODELS, type Model } from "../models";
import useFileHandler from "../hooks/useFileHandler";
import {
	useModelContext,
	type ModelContextProps,
} from "../providers/ModelProvider";
import { useDialog } from "../providers/DialogProvider";

const ModelDialogList = () => {
	const { writeFile } = useFileHandler();
	const { setActiveAgentModel } = useModelContext() as ModelContextProps;
	const dialog = useDialog();

	const handleSelectedIndex = (item: Model) => {
		writeFile("activeAIModel", JSON.stringify(item));
		setActiveAgentModel(item);
		dialog?.close();
	};

	return (
		<box>
			<DialogSearchList
				handleSelectedIndex={handleSelectedIndex}
				placeHolder="Search AI models"
				emptyText="Model not found"
				listItems={MODELS}
				renderItem={(item: Model, isSelected) => {
					return (
						<text fg={isSelected ? "#fff" : "gray"} paddingY={2} paddingX={1}>
							{item.name}
						</text>
					);
				}}
			/>
			<box justifyContent="center" alignItems="center">
				<text fg="gray" paddingY={1}>
					Powered By Venice AI
				</text>
			</box>
		</box>
	);
};

export default ModelDialogList;
