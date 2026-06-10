import {
	InputRenderable,
	ScrollBoxRenderable,
	TextAttributes,
} from "@opentui/core";
import { useCallback, useRef, useState, type ReactNode } from "react";
import {
	useKeyboardContext,
	type KeyboardContextProviderProps,
} from "../../providers/KeyboardProvider";
import { useKeyboard } from "@opentui/react";

type DialogSearchProps<T> = {
	placeHolder: string;
	emptyText: string;
	listItems: T[];
	renderItem: (item: T, isSelected: boolean) => ReactNode;
	handleHighlightedIndex: (index: T) => void;
	handleSelectedIndex: (index: T) => void;
};

const MAX_VISIBLE_ITEMS = 4;

const DialogSearchList = <T,>({
	placeHolder,
	listItems,
	handleHighlightedIndex,
	handleSelectedIndex,
	emptyText,
	renderItem,
}: DialogSearchProps<T>) => {
	const inputRef = useRef<InputRenderable | null>(null);
	const scrollRef = useRef<ScrollBoxRenderable | null>(null);
	const [searchValue, setSearchValue] = useState("");
	const [selectedIndex, setSelectedIndex] = useState(0);

	const visibleEnd = Math.min(listItems.length, MAX_VISIBLE_ITEMS);

	const filteredItems = listItems.filter((item) =>
		item.name.toLowerCase().includes(searchValue.toLowerCase()),
	);

	const { isTopLayer } = useKeyboardContext() as KeyboardContextProviderProps;

	const handleContentChange = useCallback(() => {
		const text = inputRef.current?.value ?? "";
		setSearchValue(text);
		setSelectedIndex(0);

		const scrollbox = scrollRef.current;

		if (scrollbox) {
			scrollbox.scrollTo(0);
		}
	}, []);

	useKeyboard((key) => {
		if (!isTopLayer("dialog")) return;

		if (key.name === "x") {
			key.preventDefault();
			const item = filteredItems[selectedIndex];
			if (item) {
				handleSelectedIndex(item);
			}
		} else if (key.name === "up") {
			key.preventDefault();
			setSelectedIndex((i) => {
				const newIndex = Math.max(0, i - 1);

				const sb = scrollRef.current;
				if (sb && newIndex < sb.scrollTop) {
					sb.scrollTo(newIndex);
				}
				const item = filteredItems[newIndex];
				if (item && handleHighlightedIndex) handleHighlightedIndex(item);
				return newIndex;
			});
		} else if (key.name === "down") {
			key.preventDefault();
			setSelectedIndex((i) => {
				const newIndex = Math.min(filteredItems.length - 1, i + 1);
				const sb = scrollRef.current;

				const viewHeight = sb?.viewport?.height;
				const visibleEnd = sb.scrollTop + viewHeight - 1;

				if (newIndex > visibleEnd) {
					sb.scrollTo(newIndex - visibleEnd + 1);
				}
				const item = filteredItems[newIndex];
				if (item && handleHighlightedIndex) handleHighlightedIndex(item);
				return newIndex;
			});
		}
	});

	return (
		<box paddingY={1} paddingX={1}>
			<input
				placeholder={placeHolder}
				onContentChange={handleContentChange}
				ref={inputRef}
				paddingY={1}
				focused={true}
			/>
			<scrollbox ref={scrollRef} height={visibleEnd}>
				{filteredItems.length == 0 ? (
					<text attributes={TextAttributes.DIM}>{emptyText}</text>
				) : (
					filteredItems.map((item: T, id: number) => {
						const isSelected = id === selectedIndex;
						return (
							<box
								key={id}
								flexDirection="row"
								height={1}
								overflow="hidden"
								backgroundColor={isSelected ? "#E67E22" : "#000"}
								onMouseMove={() => {
									setSelectedIndex(id);
									if (handleHighlightedIndex) {
										handleHighlightedIndex(item, isSelected);
									}
								}}
								onMouseDown={() => handleSelectedIndex(item)}
							>
								{renderItem(item, isSelected)}
							</box>
						);
					})
				)}
			</scrollbox>
		</box>
	);
};

export default DialogSearchList;
