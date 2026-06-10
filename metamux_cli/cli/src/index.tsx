import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import RootLayout from "./layouts/";
import Home from "./screens/Home";
import NewSession from "./screens/NewSession";

const router = createMemoryRouter([
	{
		path: "/",
		element: <RootLayout />,
		children: [
			{ index: true, element: <Home /> },
			{ path: "/session/new", element: <NewSession /> },
		],
	},
]);

const App = () => {
	return <RouterProvider router={router} />;
};

const renderer = await createCliRenderer({
	targetFps: 60,
	exitOnCtrlC: false,
});

createRoot(renderer).render(<App />);
