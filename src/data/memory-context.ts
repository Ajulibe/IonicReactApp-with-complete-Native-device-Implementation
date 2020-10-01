import React from "react";

export interface Memory {
  id: string;
  imagePath: string;
  title: string;
  type: "good" | "bad";
  base64Url: string;
}

//CONTEXT in Typescript is always made up of
// 1). The initial Values that the context is
//sending, which is most times made up of the state and the dispatch.

//2). the type definition of these values in <>

const MemoriesContext = React.createContext<{
  memories: Memory[];
  addMemory: (
    path: string,
    base64Data: string,
    title: string,
    type: "good" | "bad"
  ) => void;
  initContext: () => void;
}>({ memories: [], addMemory: () => {}, initContext: () => {} });

export default MemoriesContext;
