type Props = {
  message: string;
};

const index = ({ message }: Props) => {
  return (
    <box width="100%" alignItems="center">
      <box border={["left"]} borderColor="#56D6C2" width="100%">
        <box width="100%" paddingX={2} paddingY={1} backgroundColor={"#1a1a1a"}>
          <text>{message}</text>
        </box>
      </box>
    </box>
  );
};

export default index;
