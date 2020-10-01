import React, { useContext } from "react";

import MemoriesContext from "../data/memory-context";
import MemoriesContent from "../components/MemoriesContent";

const GoodMemories: React.FC = () => {
  const memoriesCtx = useContext(MemoriesContext);

  const goodMemories = memoriesCtx.memories.filter(
    (memory) => memory.type === "good"
  );

  return (
    <MemoriesContent
      title="Good Memories"
      fallbackText="No Good Memories Found."
      memories={goodMemories}
    />
  );
};

export default GoodMemories;
