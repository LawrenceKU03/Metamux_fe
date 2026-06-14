import crypto from "crypto";
import useCompression from "./useCompression";

export const MASTER_KEY = "metamux-secret-workspace-salt-key";
const KRYPTO_KEY = crypto.createHash("sha256").update(MASTER_KEY).digest();
const KRYPTO_IV = crypto
	.createHash("sha256")
	.update(MASTER_KEY)
	.digest()
	.subarray(0, 16);

const useEncryptionHandler = () => {
	const { pack, unpack } = useCompression();

	const createToken = (text: string): string => {
		const cipher = crypto.createCipheriv("aes-256-cbc", KRYPTO_KEY, KRYPTO_IV);
		let encrypted = cipher.update(pack(text), "utf8", "hex");
		encrypted += cipher.final("hex");
		return encrypted;
	};

	const readToken = (token: string): string => {
		const decipher = crypto.createDecipheriv(
			"aes-256-cbc",
			KRYPTO_KEY,
			KRYPTO_IV,
		);
		let decrypted = decipher.update(token, "hex", "utf8");
		decrypted += decipher.final("utf8");
		return unpack(decrypted);
	};

	return {
		createToken,
		readToken,
	};
};

export default useEncryptionHandler;
