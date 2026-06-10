import { TextAttributes } from "@opentui/core";

type Props = {
  message: string;
};

const index = ({ message }: Props) => {
  return (
    <box width="100%" alignItems="center">
      <box border={["left"]} borderColor={"#E74C5E"} width="100%">
        <box width="100%" paddingX={2} paddingY={1} backgroundColor={"#1a1a1a"}>
          <text attributes={TextAttributes.DIM}>{message}</text>
        </box>
      </box>
    </box>
  );
};

export default index;
