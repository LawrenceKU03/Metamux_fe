import { TextAttributes } from "@opentui/core";

const index = () => {
  return (<box flexDirection="row" alignItems="center" gap={1}>
    <text>Build</text>
    <text fg="gray" attributes={TextAttributes.DIM}>></text>
    <text>Venice AI</text>
  </box>
  );
};

export default index;
