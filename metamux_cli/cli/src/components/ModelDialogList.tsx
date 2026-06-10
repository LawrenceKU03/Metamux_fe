import DialogSearchList from "./DialogSearchList";
import { MODELS, type Model } from "../models";
import useFileHandler from "../hooks/useFileHandler";

const ModelDialogList = () => {
	const { writeFile } = useFileHandler();

	const handleHightLightedIndex = (item: Model) => {
		writeFile("activeAIModel", JSON.stringify(item));
	};

	return (
		<box>
			<DialogSearchList
				handleHighlightedIndex={handleHightLightedIndex}
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
