import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const CONFIG_DIR = join(homedir(), ".metamux");

const useFileHandler = () => {
	const writeFile = (fileName: string, content: string) => {
		const FILE_PREFERENCE_PATH = join(CONFIG_DIR, `${fileName}.json`);

		try {
			mkdirSync(CONFIG_DIR, { recursive: true });
			writeFileSync(FILE_PREFERENCE_PATH, content, "utf8");
		} catch (error) {}
	};

	const readFile = (fileName: string): any => {
		const FILE_PREFERENCE_PATH = join(CONFIG_DIR, `${fileName}.json`);
		try {
			return JSON.parse(readFileSync(FILE_PREFERENCE_PATH, "utf8"));
		} catch (error) {}
	};

	return { writeFile, readFile };
};

export default useFileHandler;
