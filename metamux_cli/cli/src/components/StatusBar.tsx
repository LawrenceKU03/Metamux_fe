import { TextAttributes } from "@opentui/core";
import useFileHandler from "../hooks/useFileHandler";
import { useEffect, useState } from "react";
import type { Model } from "../models";

const index = () => {

  const [activeAgentModel, setActiveAngle] = useState<Model>({
    id: "e2ee-venice-uncensored",
    name: "Venice Uncensored 1.1",
    contextWindow: 32000,
  },
  );
  const { readFile } = useFileHandler();

  useEffect(() => {
    setActiveAngle(readFile("activeAIModel"));
  }, [])

  return (
    <box flexDirection="row" alignItems="center" gap={1}>
      <text attributes={TextAttributes.BOLD}>Idle</text>
      <text fg="gray" attributes={TextAttributes.DIM}>></text>
      <text>{activeAgentModel.name}</text>
    </box>
  );
};

export default index;
