import React, { useState } from "react";
import MemoriesContext, { Memory } from "./memory-context";

//NOTE: A provider is a normaL SUPER functional Component wich its complete
//state management system and event handling functions
//and it wraps around the APP component. it takes in values which
//are the state and the event handling functions and makes these values available
//globally.

const MemoriesContextProvider: React.FC = (props) => {
  const [memories, setMemories] = useState<Memory[]>([]);

  const addMemory = (path: string, title: string, type: "good" | "bad") => {
    const newMemory: Memory = {
      id: Math.random().toString(),
      title: title,
      type: type,
      imagePath: path,
    };

    setMemories((curMemories) => {
      return [...curMemories, newMemory];
    });
  };

  return (
    <MemoriesContext.Provider
      value={{
        memories,
        addMemory,
      }}
    >
      {props.children}
    </MemoriesContext.Provider>
  );
};

export default MemoriesContextProvider;
