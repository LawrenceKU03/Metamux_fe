import { createCliRenderer, TextAttributes } from "@opentui/core";
import { createRoot } from "@opentui/react";

import Header from "./components/Header";
import InputBar from "./components/InputBar";
import { KeyboardProvider } from "./providers/KeyboardProvider";

function App() {
	return (
		<KeyboardProvider>
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
						<InputBar />
					</box>
				</box>
			</box>
		</KeyboardProvider>
	);
}

const renderer = await createCliRenderer();
createRoot(renderer).render(<App />);
