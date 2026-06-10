import DialogSearchList from "./DialogSearchList";
import { MODELS, type Model } from "../models";

const ModelDialogList = () => {
	return (
		<box>
			<DialogSearchList
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
