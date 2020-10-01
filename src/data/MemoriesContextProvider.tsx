import React, { useState, useEffect, useCallback } from "react";
import { FilesystemDirectory, Plugins } from "@capacitor/core";

import MemoriesContext, { Memory } from "./memory-context";

//this is used to store all images that are taken
const { Storage, Filesystem } = Plugins;

//NOTE: A provider is a normaL SUPER functional Component wich its complete
//state management system and event handling functions
//and it wraps around the APP component. it takes in values which
//are the state and the event handling functions and makes these values available
//globally.

const MemoriesContextProvider: React.FC = (props) => {
  const [memories, setMemories] = useState<Memory[]>([]);

  //this is a smart way of updating an action based on a state change
  useEffect(() => {
    //here we are creating a new object and removing the base64 from the
    //object because its a long string and we dont need to store it
    const storableMemories = memories.map((memory) => {
      return {
        id: memory.id,
        title: memory.title,
        imagePath: memory.imagePath,
        type: memory.type,
      };
    });
    Storage.set({ key: "memories", value: JSON.stringify(storableMemories) });
  }, [memories]);

  //ACTION FUNCTIONS

  const addMemory = (
    path: string,
    base64Data: string,
    title: string,
    type: "good" | "bad"
  ) => {
    const newMemory: Memory = {
      id: Math.random().toString(),
      title: title,
      type: type,
      imagePath: path,
      base64Url: base64Data, //essential for image preview only
    };

    setMemories((curMemories) => {
      return [...curMemories, newMemory];
    });
  };

  const initContext = useCallback(async () => {
    const memoriesData = await Storage.get({ key: "memories" });
    const storedMemories = memoriesData.value
      ? JSON.parse(memoriesData.value)
      : [];
    const loadedMemories: Memory[] = [];
    //for all the stored memorires in the stored memories array,
    //find its image and convert the image to a base64 url.
    for (const storedMemory of storedMemories) {
      const file = await Filesystem.readFile({
        path: storedMemory.imagePath,
        directory: FilesystemDirectory.Data,
      });
      loadedMemories.push({
        id: storedMemory.id,
        title: storedMemory.title,
        type: storedMemory.type,
        imagePath: storedMemory.imagePath,
        base64Url: "data:image/jpeg;base64," + file.data,
      });
    }
    setMemories(loadedMemories);
  }, []);

  return (
    <MemoriesContext.Provider
      value={{
        memories,
        addMemory,
        initContext,
      }}
    >
      {props.children}
    </MemoriesContext.Provider>
  );
};

export default MemoriesContextProvider;
