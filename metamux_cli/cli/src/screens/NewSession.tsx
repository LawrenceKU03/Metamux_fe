import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import SessionShell from "../components/SessionShell";
import { UserMessage } from "../components/Messages";

const index = () => {
	const navig = useNavigate();
	const location = useLocation();

	const handleSubmit = useCallback(
		(text: string) => {
			navig("/session/:id", { state: { message: text } });
		},
		[navig],
	);

	const state = location.state;

	return (
		<SessionShell onSubmit={handleSubmit} loading={true}>
			<UserMessage message={state.message} />
		</SessionShell>
	);
};

export default index;
