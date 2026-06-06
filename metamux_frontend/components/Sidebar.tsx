import React from "react";
import { FiXCircle } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import useNavbar from "../hooks/useNavbar";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

type ListData = {
	title: string;
	desc?: string;
};

type SidebarProps = {
	title: string;
	listItems: ListData[];
};

const ListItem: React.FC<ListData> = ({ title, desc }) => {
	const [isShowDesc, setShowDesc] = useState<boolean>(false);

	return (
		<div
			onClick={() => setShowDesc(!isShowDesc)}
			className="hover:bg-black transition-all ease-in-out py-4 px-5 rounded-md w-full text-center cursor-pointer"
		>
			<div className="flex flex-row  items-center">
				<h1 className="text-white font-['Space_Grotesk'] text-[20px] capitalize">
					{title}
				</h1>

				{desc && (
					<FaPlus
						size={20}
						className={twMerge(
							"text-white ml-auto capitalize transition-all ease-out",
							isShowDesc && "rotate-45",
						)}
					/>
				)}
			</div>
			{isShowDesc && (
				<p className="text-white mr-auto font-['Space_Grotesk] mt-7">{desc}</p>
			)}
		</div>
	);
};

const index: React.FC<SidebarProps> = ({ title, listItems }) => {
	const close = useNavbar((state) => state.close);

	return (
		<div className="absolute top-0 z-[10] w-[30%] h-full bg-neutral-900 flex justify-center items-center flex-col px-4">
			<div className="py-4 w-full flex justify-left items-center px-8">
				<FiXCircle
					size={27}
					color="#fff"
					className="cursor-pointer ml-auto"
					onClick={() => close()}
				/>
			</div>
			<h1 className="text-3xl uppercase font-['Space_Grotesk'] text-white font-bold mx-auto mb-4">
				{title}
			</h1>
			<div className="w-full">
				{listItems?.map((data: ListData) => {
					return <ListItem title={data.title} desc={data.desc} />;
				})}
			</div>
		</div>
	);
};

export default index;
