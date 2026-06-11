import { TextAttributes } from "@opentui/core";
import { useModelContext, type ModelContextProps } from "../providers/ModelProvider";
import { useEffect } from "react";


const index = () => {

  const { activeModel, agentStatus } = useModelContext() as ModelContextProps;

  useEffect(() => { }, [activeModel])

  return (
    <box flexDirection="row" alignItems="center" gap={1}>
      <text attributes={TextAttributes.BOLD}>{agentStatus}</text>
      <text fg="gray" attributes={TextAttributes.DIM}>></text>
      <text>{activeModel.name}</text>
    </box>
  );
};

export default index;
