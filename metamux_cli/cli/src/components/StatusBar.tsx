import { TextAttributes } from "@opentui/core";

const index = () => {
  return (<box flexDirection="row" alignItems="center" gap={1}>
    <text attributes={TextAttributes.BOLD}>Idle</text>
    <text fg="gray" attributes={TextAttributes.DIM}>></text>
    <text>Venice Uncensored 1.1</text>
  </box>
  );
};

export default index;
