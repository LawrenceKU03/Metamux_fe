const index = () => {
	return (
		<box alignItems="center" justifyContent="center">
			<box
				justifyContent="center"
				alignItems="flex-end"
				flexDirection="row"
				gap={0.5}
			>
				<ascii-font font="tiny" text="Meta" color="gray" />
				<ascii-font font="tiny" text="Mux" />
			</box>
		</box>
	);
};

export default index;
