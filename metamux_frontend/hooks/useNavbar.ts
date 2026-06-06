import { create } from "zustand";

type NavOpenData = {
	isOpen: boolean;
	sectionOpen: string;
};

type NavbarHookProps = {
	isNavOpen: NavOpenData | null;
	setIsOpen: (openSection: string) => void;
	close: () => void;
};

const useNavbar = create<NavbarHookProps>((set) => ({
	isNavOpen: null,
	setIsOpen: (openSection: string) => {
		set(() => ({ isNavOpen: { isOpen: true, sectionOpen: openSection } }));
	},
	close: () => {
		set(() => ({ isNavOpen: null }));
	},
}));

export default useNavbar;
